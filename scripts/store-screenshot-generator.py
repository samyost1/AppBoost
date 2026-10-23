#!/usr/bin/env python3
"""
Store Screenshot Generator
Interactive script to create Play Store and App Store marketing screenshots.

Usage: python store-screenshot-generator.py

Requirements: pip install Pillow questionary
"""

import os
import sys
import re
from pathlib import Path
from datetime import datetime

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Error: Pillow is required. Install with: pip install Pillow")
    sys.exit(1)

try:
    import questionary
    from questionary import Style
except ImportError:
    print("Error: questionary is required. Install with: pip install questionary")
    sys.exit(1)

# Custom style for questionary
custom_style = Style([
    ('qmark', 'fg:cyan bold'),
    ('question', 'fg:white bold'),
    ('answer', 'fg:cyan bold'),
    ('pointer', 'fg:cyan bold'),
    ('highlighted', 'fg:cyan bold'),
    ('selected', 'fg:green'),
])

# Configuration
SCRIPT_DIR = Path(__file__).parent
ASSETS_DIR = SCRIPT_DIR / "assets"
FONT_PATH = SCRIPT_DIR / "fonts" / "Montserrat-SemiBold.ttf"
OUTPUT_DIR = SCRIPT_DIR / "output"
SCREENSHOTS_DIR = SCRIPT_DIR / "screenshots"

# Supported image extensions
IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.webp', '.bmp'}

# Play Store configuration
PLAY_STORE_CONFIG = {
    "canvas_size": (1080, 1920),
    "phone_layer": ASSETS_DIR / "play-store" / "phone layer.png",
    "output_dir": OUTPUT_DIR / "play-store",
    "screen_x": 163,
    "screen_y": 477,
    "screen_width": 764,
    "corner_radius": 45,
    "text_y": 120,
    "font_size": 96,
    "text_max_width": 1000,
    "line_spacing": 1.2,
}

# App Store configuration
APP_STORE_CONFIG = {
    "canvas_size": (1290, 2796),
    "phone_layer": ASSETS_DIR / "app store" / "phone layer.png",
    "output_dir": OUTPUT_DIR / "app-store",
    "screen_x": 137,
    "screen_y": 640,
    "screen_width": 1029,
    "corner_radius": 55,
    "text_y": 140,
    "font_size": 115,
    "text_max_width": 1200,
    "line_spacing": 1.2,
}


def ensure_dirs():
    """Create required directories if they don't exist."""
    PLAY_STORE_CONFIG["output_dir"].mkdir(parents=True, exist_ok=True)
    APP_STORE_CONFIG["output_dir"].mkdir(parents=True, exist_ok=True)
    SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)


def get_available_screenshots() -> list:
    """Get list of available screenshots in the screenshots folder."""
    if not SCREENSHOTS_DIR.exists():
        return []

    screenshots = []
    for file in SCREENSHOTS_DIR.iterdir():
        if file.is_file() and file.suffix.lower() in IMAGE_EXTENSIONS:
            screenshots.append(file)

    # Sort by modification time (newest first)
    screenshots.sort(key=lambda f: f.stat().st_mtime, reverse=True)
    return screenshots


def parse_hex_color(hex_color: str) -> tuple:
    """Parse a hex color string to RGB tuple."""
    hex_color = hex_color.strip().lstrip('#')
    if len(hex_color) != 6:
        raise ValueError(f"Invalid hex color: {hex_color}")
    if not re.match(r'^[0-9A-Fa-f]{6}$', hex_color):
        raise ValueError(f"Invalid hex color: {hex_color}")
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


def validate_hex_color(hex_color: str) -> bool:
    """Validate hex color format."""
    hex_color = hex_color.strip().lstrip('#')
    if len(hex_color) != 6:
        return False
    return bool(re.match(r'^[0-9A-Fa-f]{6}$', hex_color))


def create_rounded_rectangle_mask(size: tuple, radius: int, corners: tuple = (True, True, False, False)) -> Image.Image:
    """Create a mask with rounded corners."""
    mask = Image.new('L', size, 255)
    draw = ImageDraw.Draw(mask)

    width, height = size
    top_left, top_right, bottom_left, bottom_right = corners

    if top_left:
        draw.rectangle([0, 0, radius, radius], fill=0)
        draw.ellipse([0, 0, radius * 2, radius * 2], fill=255)

    if top_right:
        draw.rectangle([width - radius, 0, width, radius], fill=0)
        draw.ellipse([width - radius * 2, 0, width, radius * 2], fill=255)

    if bottom_left:
        draw.rectangle([0, height - radius, radius, height], fill=0)
        draw.ellipse([0, height - radius * 2, radius * 2, height], fill=255)

    if bottom_right:
        draw.rectangle([width - radius, height - radius, width, height], fill=0)
        draw.ellipse([width - radius * 2, height - radius * 2, width, height], fill=255)

    return mask


def wrap_text(text: str, font: ImageFont.FreeTypeFont, max_width: int, draw: ImageDraw.Draw) -> list:
    """Wrap text to fit within a maximum width, respecting manual line breaks."""
    # First split by manual line breaks
    paragraphs = text.split('\n')
    all_lines = []

    for paragraph in paragraphs:
        if not paragraph.strip():
            all_lines.append('')
            continue

        words = paragraph.split()
        current_line = []

        for word in words:
            test_line = ' '.join(current_line + [word])
            bbox = draw.textbbox((0, 0), test_line, font=font)
            line_width = bbox[2] - bbox[0]

            if line_width <= max_width:
                current_line.append(word)
            else:
                if current_line:
                    all_lines.append(' '.join(current_line))
                current_line = [word]

        if current_line:
            all_lines.append(' '.join(current_line))

    return all_lines if all_lines else [text]


def generate_output_filename(input_path: str, store_type: str) -> str:
    """Generate output filename based on input and timestamp."""
    input_path = Path(input_path)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{input_path.stem}_{timestamp}.png"


def generate_screenshot(
    screenshot_path: str,
    text: str,
    bg_color: tuple,
    output_filename: str,
    store_type: str
) -> str:
    """Generate a store marketing screenshot."""
    config = PLAY_STORE_CONFIG if store_type == "Play Store" else APP_STORE_CONFIG

    if not config["phone_layer"].exists():
        raise FileNotFoundError(f"Phone layer not found: {config['phone_layer']}")
    if not FONT_PATH.exists():
        raise FileNotFoundError(f"Font not found: {FONT_PATH}")

    # Ensure output directory exists
    config["output_dir"].mkdir(parents=True, exist_ok=True)
    output_path = config["output_dir"] / output_filename

    # Create canvas with background color
    canvas = Image.new('RGBA', config["canvas_size"], (*bg_color, 255))

    # Load and process screenshot
    screenshot = Image.open(screenshot_path).convert('RGBA')

    # Scale screenshot to fit screen width
    screen_width = config["screen_width"]
    scale_factor = screen_width / screenshot.width
    new_height = int(screenshot.height * scale_factor)
    screenshot = screenshot.resize((screen_width, new_height), Image.Resampling.LANCZOS)

    # Create rounded corner mask for top corners only
    mask = create_rounded_rectangle_mask(
        screenshot.size,
        config["corner_radius"],
        corners=(True, True, False, False)
    )

    # Apply mask to screenshot
    screenshot.putalpha(mask)

    # Paste screenshot onto canvas
    canvas.paste(screenshot, (config["screen_x"], config["screen_y"]), screenshot)

    # Load and paste phone frame
    phone_layer = Image.open(config["phone_layer"]).convert('RGBA')
    canvas.paste(phone_layer, (0, 0), phone_layer)

    # Add text
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.truetype(str(FONT_PATH), config["font_size"])

    # Wrap text if too wide
    lines = wrap_text(text, font, config["text_max_width"], draw)

    # Calculate line height
    sample_bbox = draw.textbbox((0, 0), "Ag", font=font)
    line_height = int((sample_bbox[3] - sample_bbox[1]) * config["line_spacing"])

    # Draw each line centered horizontally
    text_y = config["text_y"]
    for i, line in enumerate(lines):
        line_bbox = draw.textbbox((0, 0), line, font=font)
        line_width = line_bbox[2] - line_bbox[0]
        line_x = (config["canvas_size"][0] - line_width) // 2
        line_y = text_y + (i * line_height)
        draw.text((line_x, line_y), line, font=font, fill=(255, 255, 255, 255))

    # Save result
    canvas = canvas.convert('RGB')
    canvas.save(output_path, 'PNG')

    return str(output_path)


def main():
    """Main interactive function."""
    print()
    print("=" * 50)
    print("  Store Screenshot Generator")
    print("=" * 50)
    print()

    # Ensure directories exist
    ensure_dirs()

    # Step 1: Select store type
    store_type = questionary.select(
        "Select store type:",
        choices=[
            "Play Store",
            "App Store"
        ],
        style=custom_style
    ).ask()

    if store_type is None:
        print("\nCancelled.")
        return

    print()

    # Step 2: Select screenshot from folder
    screenshots = get_available_screenshots()

    if not screenshots:
        print(f"No screenshots found in: {SCREENSHOTS_DIR}")
        print(f"\nPlease add your screenshots to this folder and run again.")
        return

    screenshot_choices = [f.name for f in screenshots]

    selected_name = questionary.select(
        "Select screenshot:",
        choices=screenshot_choices,
        style=custom_style
    ).ask()

    if selected_name is None:
        print("\nCancelled.")
        return

    screenshot_path = str(SCREENSHOTS_DIR / selected_name)
    print()

    # Step 3: Get text
    text = questionary.text(
        "Enter marketing text:",
        style=custom_style
    ).ask()

    if text is None:
        print("\nCancelled.")
        return

    if not text.strip():
        print("\nError: Marketing text is required.")
        return

    # Convert literal \n to actual newlines
    text = text.strip().replace('\\n', '\n')
    print()

    # Step 4: Get background color
    hex_color = questionary.text(
        "Enter background color (hex):",
        default="#141516",
        validate=lambda c: validate_hex_color(c) or "Please enter a valid 6-digit hex color (e.g., #1a1a2e)",
        style=custom_style
    ).ask()

    if hex_color is None:
        print("\nCancelled.")
        return

    bg_color = parse_hex_color(hex_color)
    print()

    # Generate output filename
    output_filename = generate_output_filename(screenshot_path, store_type)

    # Show summary
    print("-" * 50)
    print("Summary:")
    print(f"  Store:      {store_type}")
    print(f"  Screenshot: {Path(screenshot_path).name}")
    print(f"  Text:       {text}")
    print(f"  Background: {hex_color.upper()}")
    print(f"  Output:     {output_filename}")
    print("-" * 50)
    print()

    # Confirm
    confirm = questionary.confirm(
        "Generate screenshot?",
        default=True,
        style=custom_style
    ).ask()

    if not confirm:
        print("\nCancelled.")
        return

    # Generate screenshot
    print("\nGenerating screenshot...")

    try:
        output_path = generate_screenshot(screenshot_path, text, bg_color, output_filename, store_type)
        print(f"\nDone! Screenshot saved to:")
        print(f"  {output_path}")

    except Exception as e:
        print(f"\nError generating screenshot: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
