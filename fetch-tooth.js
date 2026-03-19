const fs = require('fs');

fetch('https://api.github.com/search/code?q=filename:tooth+extension:gltf', {
  headers: { 'User-Agent': 'Node' }
})
.then(r => r.json())
.then(data => {
  if (data.items) {
    console.log(data.items.slice(0, 5).map(i => `https://raw.githubusercontent.com/${i.repository.full_name}/master/${i.path}`));
  } else {
    console.log('No items found or rate limited:', data);
  }
})
.catch(e => console.error(e));
