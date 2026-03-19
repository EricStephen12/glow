'use client'

import React, { useRef, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { PerspectiveCamera, Environment, Float } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

function JourneyModel() {
    const groupRef = useRef<THREE.Group>(null)
    
    // We get the exact 3D viewport size at z=-5 so our math perfectly hits the screen edges
    const viewport = useThree((state) => state.viewport.getCurrentViewport(state.camera, [0, 0, -5]))

    // A beautiful smooth "glass" tooth to follow the journey in the background
    const geometry = useMemo(() => {
        const geo = new THREE.SphereGeometry(1, 64, 64)
        const posAttribute = geo.getAttribute('position')
        const v = new THREE.Vector3()

        for (let i = 0; i < posAttribute.count; i++) {
            v.fromBufferAttribute(posAttribute, i)
            if (v.y > 0) {
                const currentRadius = Math.sqrt(v.x * v.x + v.z * v.z)
                if (currentRadius > 0) {
                    const targetRadius = 1.0
                    const factor = Math.pow(1.0 - v.y, 0.2) 
                    v.x = v.x + (v.x / currentRadius) * (targetRadius - currentRadius) * factor
                    v.z = v.z + (v.z / currentRadius) * (targetRadius - currentRadius) * factor
                }
                v.y *= 1.4
                v.y += 0.15 * Math.abs(Math.sin(v.x * Math.PI * 1.2)) * Math.abs(Math.sin(v.z * Math.PI * 1.2))
            } else {
                const taper = Math.pow(1.0 + v.y, 1.5)
                v.z *= taper
                v.x *= (taper * 0.5 + 0.5)
                const rootDepth = Math.pow(Math.abs(v.x), 1.5) * 3.5 
                v.y *= 0.2 + rootDepth
            }
            posAttribute.setXYZ(i, v.x, v.y, v.z)
        }
        geo.computeVertexNormals()
        return geo
    }, [])

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)
        const element = groupRef.current
        if (!element) return

        // Responsive Calculations
        const isMobile = viewport.width < 15
        const targetScale = isMobile ? 0.4 : 0.7 // Keep it small
        
        // Ensure it doesn't get lost on the sides
        const padding = targetScale * 3.5 
        const maxEdgeX = (viewport.width / 2) - padding
        
        // ** THE FIX FOR DESKTOP **
        // Instead of starting way up high out of the camera view, we start it physically inside the top 
        // half of the camera view, but mathematically hidden by the CSS opacity-0!
        // It travels down gracefully to the bottom edge over the course of the whole scroll.
        const startY = viewport.height * 0.35
        const endY = -(viewport.height * 0.9)
        
        // Initial setup
        element.scale.setScalar(targetScale)
        element.position.set(-maxEdgeX, startY, -5)

        const ctx = gsap.context(() => {
            // Keep it invisible until we are out of the Hero Section!
            gsap.fromTo('.tooth-journey-wrapper', 
                { opacity: 0 },
                {
                    opacity: 1,
                    scrollTrigger: {
                        trigger: document.body,
                        start: 'top -20%', // Start sooner!
                        end: 'top -80%',
                        scrub: true
                    }
                }
            )

            // Downward movement
            gsap.to(element.position, {
                y: endY,
                ease: 'none',
                scrollTrigger: {
                    trigger: document.body,
                    start: 'top top', 
                    end: 'bottom bottom',
                    scrub: 1
                }
            })

            gsap.to(element.rotation, {
                y: Math.PI * 12, // Spin constantly
                x: Math.PI * 2,
                ease: 'none',
                scrollTrigger: {
                    trigger: document.body,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1
                }
            })

            // The Responsive Zig-Zag Path reaching EXACTLY the screen edges
            const zigZagTl = gsap.timeline({
                scrollTrigger: {
                    trigger: document.body,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1
                }
            })

            zigZagTl
                .to(element.position, { x: maxEdgeX, duration: 1, ease: 'sine.inOut' })  // Swing Far Right
                .to(element.position, { x: -maxEdgeX, duration: 1, ease: 'sine.inOut' }) // Swing Far Left
                .to(element.position, { x: maxEdgeX, duration: 1, ease: 'sine.inOut' })  // Swing Far Right
                .to(element.position, { x: -maxEdgeX, duration: 1, ease: 'sine.inOut' }) // Swing Far Left
                .to(element.position, { x: 0, duration: 1, ease: 'sine.inOut' })  // Land Center at bottom
        })

        return () => ctx.revert()
    }, [viewport.width, viewport.height])

    return (
        <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
            <group ref={groupRef} rotation={[0.4, 0.2, 0.1]}>
                <mesh geometry={geometry} castShadow receiveShadow>
                    <meshPhysicalMaterial 
                        color="#ffffff"
                        roughness={0.15}
                        metalness={0.05}
                        clearcoat={1.0}
                        clearcoatRoughness={0.1}
                        transmission={0.1} 
                        thickness={2.0}
                    />
                </mesh>
            </group>
        </Float>
    )
}

export default function ToothJourney() {
    return (
        <div className="tooth-journey-wrapper fixed inset-0 z-[40] pointer-events-none overflow-hidden opacity-0">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
                <Suspense fallback={null}>
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[5, 10, 5]} intensity={2.0} color="#8277E0" />
                    <JourneyModel />
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    )
}
