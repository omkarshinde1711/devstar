<script>
    let originalImage = null;
    let simulatedImages = {};
    let loading = false;
  
    const types = ['deuteranopia', 'protanopia', 'tritanopia'];
  
    async function handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        loading = true;
        originalImage = URL.createObjectURL(file);
  
        const formData = new FormData();
        formData.append('file', file);
  
        simulatedImages = {};
  
        for (const type of types) {
          formData.set('type', type);
  
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
  
          if (response.ok) {
            const data = await response.json();
            simulatedImages[type] = data.simulatedImagePath;
          }
        }
        loading = false;
      }
    }
  </script>
  
  <main>
    <h1>Color Blindness Simulator</h1>
    <div>
      <input type="file" accept="image/*" on:change="{handleImageUpload}" />
    </div>
    {#if loading}
      <p>Processing images, please wait...</p>
    {/if}
    {#if originalImage && !loading}
      <div class="image-grid">
        <div class="image-container">
          <h2>Original Image</h2>
          <img src="{originalImage}" alt="Original image uploaded by user" />
        </div>
        {#each types as type}
          <div class="image-container">
            <h2>{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
            {#if simulatedImages[type]}
              <img src="{simulatedImages[type]}" alt="Simulated image showing {type} effect" />
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </main>
  
  <style>
    main {
      padding: 1em;
    }
    .image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1em;
    }
    .image-container {
      text-align: center;
    }
    img {
      max-width: 100%;
      height: auto;
    }
  </style>
  