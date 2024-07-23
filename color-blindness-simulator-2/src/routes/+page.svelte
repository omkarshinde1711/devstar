<script>
    let imageUrl = '';
    let imageCanvas;
    let imageCtx;
    let img;
  
    const filters = {
      protanopia: [0.567, 0.433, 0, 0, 0, 0.558, 0.442, 0, 0, 0, 0, 0.242, 0.758, 0, 0, 0, 0, 0, 1, 0],
      deuteranopia: [0.625, 0.375, 0, 0, 0, 0.7, 0.3, 0, 0, 0, 0, 0.3, 0.7, 0, 0, 0, 0, 0, 1, 0],
      tritanopia: [0.95, 0.05, 0, 0, 0, 0, 0.433, 0.567, 0, 0, 0, 0, 0.475, 0.525, 0, 0, 0, 0, 0, 1],
      achromatopsia: [0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0, 0, 0, 1, 0],
      achromatomaly: [0.618, 0.320, 0.062, 0, 0, 0.163, 0.775, 0.062, 0, 0, 0.163, 0.320, 0.516, 0, 0, 0, 0, 0, 1, 0],
      tritanomaly: [0.967, 0.033, 0, 0, 0, 0, 0.733, 0.267, 0, 0, 0, 0.183, 0.817, 0, 0, 0, 0, 0, 1, 0],
      protanomaly: [0.817, 0.183, 0, 0, 0, 0.333, 0.667, 0, 0, 0, 0, 0.125, 0.875, 0, 0, 0, 0, 0, 1, 0],
      deuteranomaly: [0.8, 0.2, 0, 0, 0, 0.258, 0.742, 0, 0, 0, 0, 0.142, 0.858, 0, 0, 0, 0, 0, 1, 0]
    };
  
    function handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          imageUrl = reader.result;
          img = new Image();
          img.src = imageUrl;
          img.onload = () => {
            if (imageCanvas) {
              imageCanvas.width = img.width;
              imageCanvas.height = img.height;
              imageCtx = imageCanvas.getContext('2d');
              imageCtx.drawImage(img, 0, 0);
            }
          };
          img.onerror = () => {
            alert('Error loading image.');
          };
        };
        reader.readAsDataURL(file);
      }
    }
  
    function applyFilter(filterName) {
      if (!filters[filterName] || !imageCanvas || !img) return;
  
      const filterMatrix = filters[filterName];
      imageCtx.drawImage(img, 0, 0);
      const imageData = imageCtx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
      const data = imageData.data;
  
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        data[i] = filterMatrix[0] * r + filterMatrix[1] * g + filterMatrix[2] * b;
        data[i + 1] = filterMatrix[5] * r + filterMatrix[6] * g + filterMatrix[7] * b;
        data[i + 2] = filterMatrix[10] * r + filterMatrix[11] * g + filterMatrix[12] * b;
      }
  
      imageCtx.putImageData(imageData, 0, 0);
    }
  
    function downloadImage() {
      if (imageCanvas) {
        const link = document.createElement('a');
        link.href = imageCanvas.toDataURL('image/png');
        link.download = 'colorblind-filtered-image.png';
        link.click();
      }
    }
  </script>
  
  <style>
    canvas {
      border: 1px solid #ccc;
      display: block;
      margin: 20px 0;
    }
  </style>
  
  <main>
    <h1>Color Blindness Simulator</h1>
    
    <input type="file" accept="image/*" on:change="{handleImageUpload}" />
    
    {#if imageUrl}
      <canvas bind:this="{imageCanvas}"></canvas>
      
      <div>
        <button on:click={() => applyFilter('protanopia')}>Protanopia</button>
        <button on:click={() => applyFilter('deuteranopia')}>Deuteranopia</button>
        <button on:click={() => applyFilter('tritanopia')}>Tritanopia</button>
        <button on:click={() => applyFilter('achromatopsia')}>Achromatopsia</button>
        <button on:click={() => applyFilter('achromatomaly')}>Achromatomaly</button>
        <button on:click={() => applyFilter('tritanomaly')}>Tritanomaly</button>
        <button on:click={() => applyFilter('protanomaly')}>Protanomaly</button>
        <button on:click={() => applyFilter('deuteranomaly')}>Deuteranomaly</button>
        <button on:click={downloadImage}>Download Image</button>
      </div>
    {/if}
  </main>
