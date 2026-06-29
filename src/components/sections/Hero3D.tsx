'use client'

import React, { Suspense, useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
    PerspectiveCamera,
    Environment,
    ContactShadows,
    Float,
    OrbitControls
} from '@react-three/drei'
import gsap from 'gsap'
import { ArrowRight, Phone, Calendar, Star, Play } from 'lucide-react'
import Link from 'next/link'

// Procedural 3D Tooth Generator
function ProceduralTooth() {
    const geometry = useMemo(() => {
        const sphereParams = { radius: 1, widthSegments: 128, heightSegments: 128 }
        const geo = new THREE.SphereGeometry(sphereParams.radius, sphereParams.widthSegments, sphereParams.heightSegments)
        const posAttribute = geo.getAttribute('position')
        const v = new THREE.Vector3()

        for (let i = 0; i < posAttribute.count; i++) {
            v.fromBufferAttribute(posAttribute, i)

            if (v.y > 0) {
                // Crown (Top half)
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
                // Roots (Bottom half)
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

    return (
        <group position={[0, 0.4, 0]}>
            <mesh geometry={geometry} scale={0.75} castShadow receiveShadow>
                <meshPhysicalMaterial 
                    color="#ffffff"
                    roughness={0.15}
                    metalness={0.05}
                    clearcoat={1.0}
                    clearcoatRoughness={0.1}
                    transmission={0.05}
                    thickness={0.5}
                />
            </mesh>
        </group>
    )
}

function CentralElement() {
    const groupRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
        }
    })

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            {/* Studio Lighting with a Splash of Color */}
            <ambientLight intensity={0.5} />
            <pointLight position={[3, 2, 4]} intensity={5.0} color="#8277E0" />
            <pointLight position={[-3, -1, 3]} intensity={3.0} color="#E0E7FF" />
            
            <group ref={groupRef}>
                <ProceduralTooth />
            </group>

            {/* Base/Pedestal */}
            <mesh position={[0, -1.0, 0]} receiveShadow>
                <cylinderGeometry args={[1.5, 1.5, 0.15, 64]} />
                <meshStandardMaterial color="#f8faff" roughness={0.2} metalness={0.1} />
            </mesh>
        </Float>
    )
}

export default function Hero3D() {
    const containerRef = useRef<HTMLElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const subRef = useRef<HTMLDivElement>(null)
    const ctaRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!titleRef.current) return

        const ctx = gsap.context(() => {
            gsap.from(titleRef.current, { y: 100, opacity: 0, duration: 1.5, ease: "power4.out", delay: 0.5 })
            gsap.from(subRef.current, { y: 50, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.8 })
            gsap.from(ctaRef.current?.children || [], { 
                y: 30, opacity: 0, duration: 1, stagger: 0.1, delay: 0.5, ease: 'power3.out' 
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={containerRef} className="relative h-screen min-h-[800px] w-full bg-transparent overflow-hidden flex flex-col items-center justify-center pt-32">
            {/* Ambient Animated Splashes of Color */}
            <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-lavender/15 rounded-full mix-blend-multiply filter blur-[120px] animate-float pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-navy/10 rounded-full mix-blend-multiply filter blur-[100px] animate-float pointer-events-none" style={{ animationDelay: '2s' }} />
            
            {/* 3D Canvas Layer */}
            <div className="absolute inset-0 z-0">
                <Canvas shadows dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
                    <Suspense fallback={null}>
                        <CentralElement />
                        <Environment preset="studio" />
                        <ContactShadows
                            position={[0, -1.0, 0]}
                            opacity={0.4}
                            scale={10}
                            blur={2}
                            far={4}
                        />
                    </Suspense>
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        minPolarAngle={Math.PI / 2.5}
                        maxPolarAngle={Math.PI / 1.5}
                    />
                </Canvas>
            </div>

            {/* UI Content Layer */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center pointer-events-none">
                <div ref={subRef} className="mb-8 pointer-events-auto">
                    <p className="text-lavender/60 text-[10px] font-bold uppercase tracking-[0.6em] mb-4">A new standard in dental artistry</p>
                    <div className="h-[1px] w-12 bg-lavender/30 mx-auto" />
                </div>

                <h1
                    ref={titleRef}
                    className="text-[12vw] md:text-[8vw] lg:text-[7vw] font-medium text-navy leading-[0.9] tracking-tighter mb-12 font-display uppercase"
                >
                    Glow<br />
                    <span className="italic font-light text-lavender">Dental.</span>
                </h1>

                <div ref={ctaRef} className="flex flex-col items-center gap-12 pointer-events-auto">
                    <p className="max-w-md text-navy/60 text-sm md:text-lg font-medium leading-relaxed shadow-sm bg-white/40 backdrop-blur-sm p-4 rounded-3xl border border-white/50">
                        We believe a smile should be as unique as the person wearing it.<br />
                        <span className="text-navy">Our doctors combine precise surgical care with a natural, aesthetic eye.</span>
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6">
                        <Link href="/book" className="bg-navy text-white px-10 py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center justify-center gap-4 group">
                            Book a Consultation
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                        </Link>
                        <button className="bg-white/80 backdrop-blur-md text-navy px-10 py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] border border-navy/10 transition-all hover:bg-white hover:scale-105 active:scale-95 flex items-center justify-center gap-4 shadow-xl">
                            <Play className="w-4 h-4" /> Watch the Showreel
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Decor */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30 pointer-events-none">
                <div className="h-16 w-[1px] bg-navy/20 animate-pulse" />
                <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-navy">Scroll Experience</p>
            </div>
        </section>
    )
}
