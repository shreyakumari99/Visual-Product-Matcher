import clip
import torch
from PIL import Image

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

def get_clip_predictions(image_path):
    image = preprocess(Image.open(image_path)).unsqueeze(0).to(device)

    # Predefined text snippets for matching (you can modify this list as per your use case)
    text = ["a product", "a dog", "a cat", "a computer", "a smartphone", "a shirt"]
    text_inputs = clip.tokenize(text).to(device)

    with torch.no_grad():
        image_features = model.encode_image(image)
        text_features = model.encode_text(text_inputs)
    
    # Normalize features
    image_features /= image_features.norm(dim=-1, keepdim=True)
    text_features /= text_features.norm(dim=-1, keepdim=True)
    
    similarity = (100.0 * image_features @ text_features.T).softmax(dim=-1)
    values, indices = similarity[0].topk(3)  # Get top 3 predictions

    # Collect the top 3 predictions
    predictions = [{"label": text[idx], "score": values[idx].item()} for idx in indices]
    
    return predictions
