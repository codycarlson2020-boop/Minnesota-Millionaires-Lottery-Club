from PIL import Image, ImageDraw, ImageFont
import os

def create_favicon():
    # Size
    size = (512, 512)
    
    # Create transparent image
    img = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Colors
    red_color = "#C0392B"
    white_color = "#FFFFFF"
    
    # Draw Circle
    # Leave a small padding for anti-aliasing smoothness at edges
    padding = 10
    draw.ellipse([padding, padding, size[0]-padding, size[1]-padding], fill=red_color)
    
    # Draw Text
    try:
        # Try to load a standard font, or fallback to default
        # On Windows, Arial is usually available
        font = ImageFont.truetype("arial.ttf", 280)
    except IOError:
        font = ImageFont.load_default()
        print("Arial font not found, using default.")

    text = "MN"
    
    # Get text bounding box to center it
    # left, top, right, bottom
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Calculate position
    x = (size[0] - text_width) / 2
    y = (size[1] - text_height) / 2 - (bbox[1] * 0.5) # Adjust for baseline
    
    draw.text((x, y), text, font=font, fill=white_color)
    
    # Save
    output_dir = "public"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    favicon_path = os.path.join(output_dir, "favicon.png")
    logo_path = os.path.join(output_dir, "logo.png")
    
    img.save(favicon_path, "PNG")
    img.save(logo_path, "PNG")
    
    # Also save a smaller 32x32 version for true favicon use if needed, 
    # but modern browsers handle resizing well. 
    # Let's just keep the high-res one for now as it looks better on high-DPI screens.
    
    print(f"Generated {favicon_path} and {logo_path}")

if __name__ == "__main__":
    create_favicon()
