# 🎨 Visual Matcher

AI-powered visual similarity search for product matching using CLIP embeddings
A full-stack application that leverages OpenAI's CLIP model to find visually similar products through intelligent image analysis and semantic understanding. Perfect for e-commerce, retail analytics, and product discovery platforms.

## ✨ Features

**🔍 Advanced Visual Search** - Find similar products using state-of-the-art CLIP embeddings
 **🏷️ Smart Metadata Filtering** - Combine visual similarity with brand and category filters
**⚡ High Performance** - Optimized embedding computation and similarity matching
**📤 Image Upload** - Support for direct image uploads and URL-based queries
**🎯 Accurate Matching** - Leverages CLIP's multi-modal understanding for superior results
**📊 Ranked Results** - Get similarity scores with each match for transparency
**🎨 Modern UI** - Clean, responsive interface built with React and Vite

## 🏗️ Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   React     │ ◄────► │   Express    │ ◄────► │   Python    │
│   Frontend  │  REST   │   Backend    │  API    │   CLIP      │
│   (Vite)    │         │   (Node.js)  │         │   Module    │
└─────────────┘         └──────────────┘         └─────────────┘
                                │
                                ▼
                        ┌──────────────┐
                        │  Embeddings  │
                        │   Storage    │
                        └──────────────┘
```

### How It Works

1. **Embedding Generation** - Python module encodes images into high-dimensional vectors using CLIP
2. **API Layer** - Express backend exposes endpoints for querying and indexing embeddings
3. **Similarity Search** - Cosine similarity computation identifies the closest visual matches
4. **Interactive UI** - React frontend provides seamless search and filtering experience

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16.x or higher)
- **Python** 3.8+
- **npm** or **yarn**
- *(Optional)* CUDA-capable GPU for faster processing

### Installation

```bash
# Clone the repository
git clone https://github.com/ashwinabey/visual-matcher.git
cd visual-matcher

# Install JavaScript dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
```

### Generate Embeddings

Process your product image dataset:

```bash
python clip_model.py --input_dir ./data/images --output ./embeddings.json
```

**Options:**
- `--input_dir` - Directory containing product images
- `--output` - Path for the embeddings output file
- `--batch_size` - Batch size for processing (default: 32)
- `--model` - CLIP model variant (default: ViT-B/32)

### Configuration

Create a `.env` file in the root directory:

```env
# Backend Configuration
PORT=3000
EMBEDDINGS_PATH=./embeddings.json
CORS_ORIGIN=http://localhost:5173

# Python Service
PYTHON_SERVICE_URL=http://localhost:5000

# Optional: Model Settings
CLIP_MODEL=ViT-B/32
SIMILARITY_THRESHOLD=0.75
```

Frontend configuration in `vite.config.js`:

```javascript
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
}
```

### Running the Application

**Terminal 1 - Backend Server:**
```bash
npm run server
# or
node server.js
```

**Terminal 2 - Frontend Development Server:**
```bash
npm run dev
```

**Terminal 3 - Python Service (if separate):**
```bash
python app.py
```

Access the application at `http://localhost:5173`

## 📖 Usage

### Basic Visual Search

1. **Upload an image** via the UI or drag-and-drop
2. **Click "Find Similar"** to initiate the search
3. **View results** ranked by visual similarity
4. **Apply filters** for brand, category, or price range

### API Endpoints

#### Search Similar Products
```bash
POST /api/search
Content-Type: multipart/form-data

{
  "image": <file>,
  "limit": 10,
  "filters": {
    "brand": "Nike",
    "category": "shoes"
  }
}
```

#### Get Product Embedding
```bash
GET /api/embedding/:productId
```

#### Index New Product
```bash
POST /api/index
Content-Type: application/json

{
  "productId": "prod_123",
  "imageUrl": "https://example.com/image.jpg",
  "metadata": {
    "brand": "Nike",
    "category": "shoes"
  }
}
```

## 📁 Project Structure

```
visual-matcher/
├── 📄 clip_model.py          # CLIP embedding generation
├── 📄 server.js              # Express API server
├── 📄 package.json           # Node dependencies
├── 📄 requirements.txt       # Python dependencies
├── 📄 vite.config.js         # Vite configuration
├── 📄 .env.example           # Environment variables template
├── 📄 index.html             # HTML entry point
│
├── 📂 src/                   # Frontend source
│   ├── 📂 components/        # React components
│   │   ├── SearchBar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── FilterPanel.jsx
│   │   └── ResultsGrid.jsx
│   ├── 📂 hooks/             # Custom React hooks
│   ├── 📂 services/          # API client services
│   ├── 📂 utils/             # Utility functions
│   ├── App.jsx               # Main app component
│   └── main.jsx              # React entry point
│
├── 📂 public/                # Static assets
├── 📂 data/                  # Sample datasets
├── 📂 models/                # Pre-trained model files
└── 📂 embeddings/            # Generated embeddings
```

## 🔧 Advanced Configuration

### Using Different CLIP Models

```python
# In clip_model.py
AVAILABLE_MODELS = [
    "ViT-B/32",      # Fast, good for real-time
    "ViT-B/16",      # Better accuracy
    "ViT-L/14",      # Best accuracy, slower
]
```

### Performance Optimization

**For large datasets**, consider:
- Using approximate nearest neighbor libraries (FAISS, Annoy)
- Implementing embedding caching strategies
- Setting up a vector database (Pinecone, Weaviate)
- Enabling GPU acceleration for CLIP

Example with FAISS:
```python
import faiss
import numpy as np

# Build index
embeddings = np.array(embeddings_list).astype('float32')
index = faiss.IndexFlatIP(embeddings.shape[1])
index.add(embeddings)

# Search
distances, indices = index.search(query_embedding, k=10)
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Test Python module
pytest tests/
```

## 🚢 Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Manual Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy backend to your platform (Heroku, AWS, etc.)
3. Set environment variables on production
4. Ensure embeddings file is accessible

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Areas for Contribution

- 🎯 **Algorithms** - Improve similarity metrics, implement FAISS/Annoy
- ⚡ **Performance** - Optimize embedding generation and search
- 🎨 **UI/UX** - Enhance frontend design and user experience  
- 📚 **Documentation** - Improve guides, add tutorials
- 🧪 **Testing** - Add test coverage, CI/CD pipelines
- 🌐 **Features** - Multi-language support, batch processing

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and commit (`git commit -m 'Add amazing feature'`)
4. Push to your branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code follows existing style guidelines
- All tests pass
- Documentation is updated
- Commit messages are descriptive

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- **[OpenAI CLIP](https://github.com/openai/CLIP)** - The foundation of our visual understanding
- **[Vite](https://vitejs.dev/)** - Lightning-fast frontend tooling
- **[Express](https://expressjs.com/)** - Web framework for Node.js
- **[React](https://react.dev/)** - UI library





<div align="center">
  
**If you find this project helpful, please consider giving it a ⭐!**

Made with ❤️ by [Shreya Kumari]((https://github.com/shreyakumari99))

</div>
