#!/usr/bin/env python3
"""
Interactive Terminal Portfolio
A modular terminal-based portfolio showcasing skills, experience, and projects.
"""

import os
import sys
import time
import select
from datetime import datetime
from typing import Dict, List, Callable, Tuple

# Try to import terminal handling modules, but handle gracefully if they fail
try:
    import termios
    import tty
    TERMIOS_AVAILABLE = True
except ImportError:
    TERMIOS_AVAILABLE = False

# Color codes for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    
    # Additional colors for variety
    PURPLE = '\033[35m'
    YELLOW = '\033[33m'
    RED = '\033[31m'
    GREEN = '\033[32m'
    BLUE = '\033[34m'
    CYAN = '\033[36m'
    WHITE = '\033[37m'


def clear_screen():
    """Clear the terminal screen."""
    os.system('cls' if os.name == 'nt' else 'clear')


def print_border(width: int = 80, char: str = '═'):
    """Print a decorative border."""
    print(Colors.CYAN + char * width + Colors.ENDC)


def print_section_header(title: str, width: int = 80):
    """Print a formatted section header with borders."""
    print_border(width, '═')
    padding = (width - len(title) - 2) // 2
    header_line = '║' + ' ' * padding + title + ' ' * (width - len(title) - padding - 2) + '║'
    print(Colors.BOLD + Colors.HEADER + header_line + Colors.ENDC)
    print_border(width, '═')
    print()


def typewriter_effect(text: str, delay: float = 0.03):
    """Print text with a typewriter effect."""
    for char in text:
        print(char, end='', flush=True)
        time.sleep(delay)
    print()


def is_interactive_terminal():
    """Check if running in an interactive terminal environment."""
    try:
        # Check if stdin is a terminal
        if not sys.stdin.isatty():
            return False
        # Check if we have termios support on Unix-like systems
        if os.name != 'nt' and not TERMIOS_AVAILABLE:
            return False
        # Additional check for terminal capabilities
        if os.name != 'nt':
            try:
                import termios
                termios.tcgetattr(sys.stdin.fileno())
            except (termios.error, OSError):
                return False
        return True
    except (AttributeError, OSError):
        return False

def get_single_keypress():
    """Get a single keypress from stdin without pressing Enter."""
    # Check if we're in an interactive environment
    if not is_interactive_terminal():
        # Fallback to regular input for non-interactive environments
        try:
            print(f"\n{Colors.WARNING}Non-interactive environment detected. Using fallback input method.{Colors.ENDC}")
            print(f"{Colors.CYAN}Please press Enter to continue (or type 'q' and press Enter to quit): {Colors.ENDC}")
            sys.stdout.flush()  # Ensure prompt is displayed
            user_input = input().strip().lower()
            if user_input == 'q' or user_input == 'quit':
                return 'ESC'
            return 'ENTER'
        except (EOFError, KeyboardInterrupt):
            # No input available or user interrupted - gracefully exit
            print(f"\n{Colors.WARNING}Input unavailable. Exiting gracefully...{Colors.ENDC}")
            return 'ESC'
    
    if os.name == 'nt':  # Windows
        try:
            import msvcrt
            key = msvcrt.getch()
            if key == b'\xe0':  # Special key prefix on Windows
                key = msvcrt.getch()
                if key == b'H':  # Up arrow
                    return 'UP'
                elif key == b'P':  # Down arrow
                    return 'DOWN'
                elif key == b'K':  # Left arrow
                    return 'LEFT'
                elif key == b'M':  # Right arrow
                    return 'RIGHT'
            elif key == b'\r':  # Enter
                return 'ENTER'
            elif key == b'\x1b':  # Escape
                return 'ESC'
            elif key == b'\x03':  # Ctrl+C
                raise KeyboardInterrupt
            return key.decode('utf-8', errors='ignore')
        except ImportError:
            # Fallback if msvcrt is not available
            print(f"\n{Colors.WARNING}Windows terminal interaction unavailable. Using fallback input method.{Colors.ENDC}")
            print(f"{Colors.CYAN}Please press Enter to continue (or type 'q' and press Enter to quit): {Colors.ENDC}")
            sys.stdout.flush()  # Ensure prompt is displayed
            try:
                user_input = input().strip().lower()
                if user_input == 'q' or user_input == 'quit':
                    return 'ESC'
                return 'ENTER'
            except (EOFError, KeyboardInterrupt):
                print(f"\n{Colors.WARNING}Input unavailable. Exiting gracefully...{Colors.ENDC}")
                return 'ESC'
    else:  # Unix/Linux/macOS
        try:
            fd = sys.stdin.fileno()
            old_settings = termios.tcgetattr(fd)
            try:
                tty.setraw(sys.stdin.fileno())
                key = sys.stdin.read(1)
                
                if key == '\x1b':  # ESC sequence
                    key += sys.stdin.read(2)
                    if key == '\x1b[A':  # Up arrow
                        return 'UP'
                    elif key == '\x1b[B':  # Down arrow
                        return 'DOWN'
                    elif key == '\x1b[C':  # Right arrow
                        return 'RIGHT'
                    elif key == '\x1b[D':  # Left arrow
                        return 'LEFT'
                    return 'ESC'
                elif key == '\r' or key == '\n':  # Enter
                    return 'ENTER'
                elif key == '\x03':  # Ctrl+C
                    raise KeyboardInterrupt
                return key
            finally:
                termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
        except (termios.error, OSError, AttributeError):
            # Fallback to regular input for non-terminal environments
            print(f"\n{Colors.WARNING}Terminal interaction unavailable. Using fallback input method.{Colors.ENDC}")
            print(f"{Colors.CYAN}Please press Enter to continue (or type 'q' and press Enter to quit): {Colors.ENDC}")
            sys.stdout.flush()  # Ensure prompt is displayed
            try:
                user_input = input().strip().lower()
                if user_input == 'q' or user_input == 'quit':
                    return 'ESC'
                return 'ENTER'
            except (EOFError, KeyboardInterrupt):
                print(f"\n{Colors.WARNING}Input unavailable. Exiting gracefully...{Colors.ENDC}")
                return 'ESC'


def display_menu(menu_items: List[Tuple], selected_index: int = 0, title: str = "NAVIGATION MENU"):
    """Display a navigable menu with multiple input options."""
    clear_screen()
    print_section_header(title)
    
    # Enhanced navigation instructions
    print(f"{Colors.BOLD}Navigation Options:{Colors.ENDC}")
    print(f"  {Colors.OKGREEN}• Arrow Keys:{Colors.ENDC} ↑/↓ or j/k (vim-style)")
    print(f"  {Colors.OKGREEN}• Number Keys:{Colors.ENDC} 1-{len(menu_items)} to select directly")
    print(f"  {Colors.OKGREEN}• Actions:{Colors.ENDC} Enter to confirm, 'q'/ESC to quit, 'm' for menu\n")
    
    for i, (icon, name, description) in enumerate(menu_items):
        number = str(i + 1) if i < len(menu_items) - 1 else 'q'  # Last item uses 'q'
        
        if i == selected_index:
            # Highlight selected item
            print(f"  {Colors.BOLD}{Colors.HEADER}► [{number}] {icon} {name}{Colors.ENDC}")
            print(f"    {Colors.CYAN}{description}{Colors.ENDC}")
        else:
            # Regular item
            print(f"  {Colors.OKGREEN}  [{number}] {icon} {name}{Colors.ENDC}")
            print(f"    {Colors.WHITE}{description}{Colors.ENDC}")
        print()  # Add spacing between items


def validate_input(key: str, max_options: int) -> Tuple[str, int]:
    """Validate and process user input, returning action and value."""
    # Handle number keys for direct selection
    if key.isdigit():
        num = int(key)
        if 1 <= num <= max_options - 1:  # Exclude quit option from number selection
            return 'SELECT', num - 1
        elif num == max_options and max_options <= 9:  # Allow selecting quit if within range
            return 'QUIT', -1
        else:
            return 'INVALID', -1
    
    # Handle character commands
    key_lower = key.lower()
    if key_lower in ['q', 'quit']:
        return 'QUIT', -1
    elif key_lower in ['m', 'menu']:
        return 'MENU', -1
    elif key_lower in ['h', 'help']:
        return 'HELP', -1
    elif key == 'ENTER':
        return 'ENTER', -1
    elif key in ['UP', 'k']:  # Vim-style 'k' for up
        return 'UP', -1
    elif key in ['DOWN', 'j']:  # Vim-style 'j' for down
        return 'DOWN', -1
    elif key == 'ESC':
        return 'QUIT', -1
    else:
        return 'INVALID', -1


def show_help_overlay():
    """Display help overlay with navigation instructions."""
    print(f"\n{Colors.HEADER}{'═' * 60}{Colors.ENDC}")
    print(f"{Colors.BOLD}📚 NAVIGATION HELP{Colors.ENDC}")
    print(f"{Colors.HEADER}{'═' * 60}{Colors.ENDC}")
    
    help_items = [
        ("Arrow Keys", "↑/↓ - Navigate up and down through menu items"),
        ("Vim Keys", "j/k - Navigate down/up (vim-style navigation)"),
        ("Number Keys", "1-5 - Jump directly to menu item by number"),
        ("Enter", "Confirm selection and enter chosen section"),
        ("'q' or ESC", "Quit application or return to previous menu"),
        ("'m'", "Return to main menu from any section"),
        ("'h'", "Show this help information"),
        ("Ctrl+C", "Emergency exit (works anywhere)")
    ]
    
    for command, description in help_items:
        print(f"  {Colors.OKGREEN}{command:12}{Colors.ENDC} - {description}")
    
    print(f"\n{Colors.WARNING}💡 Tip: Most sections have a 'back to menu' option at the bottom{Colors.ENDC}")
    print(f"{Colors.HEADER}{'═' * 60}{Colors.ENDC}")
    print(f"{Colors.CYAN}Press any key to continue...{Colors.ENDC}")
    get_single_keypress()


def navigate_menu(menu_items: List[Tuple], title: str = "NAVIGATION MENU") -> int:
    """Handle comprehensive menu navigation with multiple input methods."""
    selected = 0
    
    while True:
        display_menu(menu_items, selected, title)
        
        try:
            key = get_single_keypress()
            action, value = validate_input(key, len(menu_items))
            
            if action == 'UP':
                selected = (selected - 1) % len(menu_items)
            elif action == 'DOWN':
                selected = (selected + 1) % len(menu_items)
            elif action == 'ENTER':
                return selected
            elif action == 'SELECT':
                return value  # Direct selection via number key
            elif action == 'QUIT':
                return -1
            elif action == 'MENU':
                return -2  # Special code for returning to main menu
            elif action == 'HELP':
                show_help_overlay()
            elif action == 'INVALID':
                # Show brief error message
                print(f"\n{Colors.WARNING}⚠ Invalid input: '{key}'. Press 'h' for help.{Colors.ENDC}")
                time.sleep(1)  # Brief pause to show error
            
        except KeyboardInterrupt:
            return -1  # Quit signal


# ============================================================================
# INTRODUCTION SECTION
# ============================================================================

def show_ascii_art():
    """Display ASCII art welcome banner."""
    ascii_art = f"""{Colors.CYAN}
    ██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗ 
    ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗
    ██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║
    ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║
    ██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝
    ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝ 
{Colors.ENDC}"""
    print(ascii_art)


def show_introduction():
    """Display the introduction section with ASCII art and bio."""
    clear_screen()
    show_ascii_art()
    
    print_section_header("WELCOME TO MY INTERACTIVE PORTFOLIO")
    
    bio = f"""
{Colors.BOLD}👋 Hello! I'm Jordan Lang{Colors.ENDC}

{Colors.OKGREEN}Full-Stack Developer | Problem Solver | Tech Enthusiast{Colors.ENDC}

I'm passionate about creating innovative solutions using modern technologies.
With experience spanning web development, automation, and system architecture,
I love turning complex problems into elegant, user-friendly applications.

{Colors.CYAN}🌟 What I do:{Colors.ENDC}
• Build scalable web applications with modern frameworks
• Develop automation tools and CLI utilities
• Design efficient database architectures
• Create responsive and accessible user interfaces

{Colors.WARNING}📍 Based in Ohio | Open to Remote Opportunities{Colors.ENDC}
"""
    
    typewriter_effect(bio, 0.02)
    
    print(f"\n{Colors.HEADER}✨ Portfolio Highlights:{Colors.ENDC}")
    print(f"{Colors.CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{Colors.ENDC}")
    highlights = f"""
{Colors.OKGREEN}🚀 Innovation-Focused:{Colors.ENDC} Always exploring new technologies and best practices
{Colors.OKBLUE}🏆 Results-Driven:{Colors.ENDC} Delivered 25+ successful projects with measurable impact
{Colors.WARNING}🤝 Collaborative:{Colors.ENDC} Strong communication skills and team leadership experience
{Colors.PURPLE}🎯 Detail-Oriented:{Colors.ENDC} Emphasis on code quality, testing, and documentation
"""
    print(highlights)
    

# ============================================================================
# RESUME SECTION
# ============================================================================

def show_skills_matrix():
    """Display a skills matrix with core and emerging skills."""
    print(f"{Colors.HEADER}🛠️ TECHNICAL SKILLS MATRIX{Colors.ENDC}")
    print(f"{Colors.CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{Colors.ENDC}")
    
    core_skills = {
        "Frontend": ["React", "Vue.js", "HTML5/CSS3", "JavaScript/TypeScript", "Responsive Design"],
        "Backend": ["Node.js", "Python", "ASP.NET Core", "RESTful APIs", "GraphQL"],
        "Databases": ["PostgreSQL", "MySQL", "MongoDB", "SQL Server", "Redis"],
        "DevOps": ["Docker", "GitHub Actions", "Vercel", "AWS", "Linux"],
        "Tools": ["Git", "VS Code", "Vite", "Webpack", "Postman"]
    }
    
    emerging_skills = ["Machine Learning", "Kubernetes", "Microservices", "WebAssembly", "Blockchain"]
    
    print(f"\n{Colors.BOLD}Core Competencies:{Colors.ENDC}")
    for category, skills in core_skills.items():
        skills_str = " • ".join(skills)
        print(f"{Colors.OKGREEN}▪ {category}:{Colors.ENDC} {skills_str}")
    
    print(f"\n{Colors.BOLD}Emerging Skills:{Colors.ENDC}")
    emerging_str = " • ".join(emerging_skills)
    print(f"{Colors.WARNING}🚀 {emerging_str}{Colors.ENDC}")


def show_experience_stats():
    """Display experience statistics and timeline."""
    print(f"\n{Colors.HEADER}📊 PROFESSIONAL EXPERIENCE{Colors.ENDC}")
    print(f"{Colors.CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{Colors.ENDC}")
    
    stats = [
        ("Years of Experience", "5+", Colors.OKGREEN),
        ("Projects Completed", "25+", Colors.OKBLUE),
        ("Technologies Mastered", "15+", Colors.WARNING),
        ("Lines of Code Written", "50,000+", Colors.PURPLE),
        ("Coffee Consumed", "∞", Colors.YELLOW)
    ]
    
    print(f"\n{Colors.BOLD}Quick Stats:{Colors.ENDC}")
    for stat, value, color in stats:
        print(f"{color}▶ {stat}: {Colors.BOLD}{value}{Colors.ENDC}")


def show_professional_journey():
    """Display professional experience timeline."""
    print(f"\n{Colors.HEADER}🗓️ PROFESSIONAL JOURNEY{Colors.ENDC}")
    print(f"{Colors.CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{Colors.ENDC}")
    
    timeline = [
        ("2024 - Present", "Senior Full-Stack Developer", [
            "Leading development of enterprise web applications",
            "Mentoring junior developers and code reviews",
            "Architecting scalable microservices solutions"
        ]),
        ("2022 - 2024", "Full-Stack Developer", [
            "Built responsive web applications using React and Node.js",
            "Developed RESTful APIs and database optimization",
            "Implemented CI/CD pipelines and automated testing"
        ]),
        ("2020 - 2022", "Frontend Developer", [
            "Created modern, accessible user interfaces",
            "Collaborated with UX/UI designers on user experience",
            "Optimized application performance and SEO"
        ])
    ]
    
    for period, role, achievements in timeline:
        print(f"\n{Colors.BOLD}{Colors.OKBLUE}{period}{Colors.ENDC}")
        print(f"{Colors.HEADER}{role}{Colors.ENDC}")
        for achievement in achievements:
            print(f"  {Colors.OKGREEN}✓{Colors.ENDC} {achievement}")


def show_resume():
    """Display the complete resume section."""
    clear_screen()
    print_section_header("PROFESSIONAL RESUME")
    
    show_skills_matrix()
    show_experience_stats()
    show_professional_journey()
    
    print(f"\n{Colors.CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{Colors.ENDC}")
    print(f"{Colors.WARNING}💡 Want to see my work in action? Type 'projects' to view my portfolio!{Colors.ENDC}")


# ============================================================================
# PROJECTS SECTION
# ============================================================================

def get_featured_projects():
    """Return a list of featured projects."""
    return [   {   'name': 'The Leather Outlet',
            'subtitle': 'Leather & Outdoor Retailer — Lake George, NY',
            'description': 'A warm, image-led website for The Leather Outlet at the World Famous Tee '
                           'Pee on Route 9: 30+ years of jackets, boots, handbags and name brands at '
                           'outlet prices, plus the on-site gold mining sluice. Built to get people '
                           'off the Northway and through the door.',
            'tech_stack': ['HTML5', 'SCSS', 'Bootstrap 5', 'JavaScript', 'Gulp', 'Vercel'],
            'highlights': [   'Full-bleed hero with click-to-call and directions',
                              'Shop-by-category and brands-we-carry sections with a logo marquee',
                              'Mining sluice attraction with a three-step how-it-works'],
            'status': 'Live',
            'url': 'https://leather-outlet.vercel.app'},
        {   'name': 'Black Label Barbecue',
            'subtitle': 'Bold BBQ Sauce Storefront',
            'description': 'A dark, fire-lit storefront for Black Label Brand Barbecue. Five '
                           'small-batch sauces, gallon jugs for crowds, recipes filtered by how you '
                           'cook, and a custom-order page that hands off to BigCommerce checkout.',
            'tech_stack': ['Next.js', 'React', 'TypeScript', 'BigCommerce', 'Vercel'],
            'highlights': [   'Product lineup with bottle and gallon-jug sizes',
                              'Cook-by-fire guides: smoker, charcoal, gas, flat top, campfire, pellet',
                              'Recipe browser filtered by sauce and method'],
            'status': 'Live',
            'url': 'https://blacklabelsauce.vercel.app'},
        {   'name': 'hey babe',
            'subtitle': 'Permanent Jewelry Studio — CT, RI, MA & NY',
            'description': 'A soft, editorial website for hey babe, a custom permanent jewelry studio '
                           'serving Connecticut, Rhode Island, Massachusetts and New York. '
                           'Scroll-scrubbed video walks visitors through the weld, and every chain, '
                           'charm, event format and FAQ lives in one data file the owner can edit.',
            'tech_stack': [   'Next.js',
                              'React',
                              'TypeScript',
                              'Tailwind CSS',
                              'Framer Motion',
                              'Lenis',
                              'Vercel'],
            'highlights': [   'Scroll-scrubbed video sections that follow the weld, frame by frame',
                              'Chain and charm menus with materials and pricing',
                              'Booking form for parties, pop-ups, weddings and corporate events'],
            'status': 'Live',
            'url': 'https://heybabe.vercel.app'},
        {   'name': 'Stuck On You',
            'subtitle': 'Permanent Jewelry Bloomington, IN',
            'description': 'A bespoke new home on the web for Stuck On You — elegant design, '
                           'effortless content editing, and lightning-fast pages. Designed & built by '
                           'JLang Development.',
            'tech_stack': ['Next.js', 'React', 'TypeScript', 'Sanity', 'Vercel'],
            'highlights': [   'Elegant, brand-led website design',
                              'Effortless content editing',
                              'Lightning-fast page performance'],
            'status': 'Live',
            'url': 'https://stuckonyoupj.com'},
        {   'name': 'Steamers Stonewall Tavern',
            'subtitle': 'Upscale-Casual Tavern — North Lima, OH',
            'description': 'A cinematic front end for a family-run Market Street tavern: a '
                           'scroll-driven walk-in from the parking lot to the octagonal bar, the full '
                           '64-dish menu, and every fact on the page traceable to a verified source.',
            'tech_stack': ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
            'highlights': [   'Scroll-scrubbed video hero that walks you into the room',
                              'Full 64-dish menu across eight sections, prices current',
                              "Live open/closed status from the restaurant's real hours"],
            'status': 'Live',
            'url': 'https://steamers-lima.vercel.app'},
        {   'name': 'Muskingum Materials',
            'subtitle': 'Aggregate & Construction Materials Supplier',
            'description': 'The newest build: a clean, conversion-focused marketing site for a '
                           'Muskingum County aggregate and construction materials supplier. Showcases '
                           'products, service areas, and capabilities with a fast, mobile-first '
                           'experience deployed on Vercel.',
            'tech_stack': ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
            'highlights': [   'Product and materials catalog presentation',
                              'Service-area and capabilities overview',
                              'Lead-generation contact and quote pathways'],
            'status': 'Live',
            'url': 'https://muskingum-materials.vercel.app'},
        {   'name': 'Safety Screen',
            'subtitle': 'Medication Search & Information Web App',
            'description': 'A fast, search-first web application for looking up medications and their '
                           'key details. Built for clarity and speed, it helps users find the '
                           'information they need across a clean, responsive interface deployed on '
                           'Vercel.',
            'tech_stack': ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
            'highlights': [   'Instant medication search and lookup',
                              'Clear, structured drug information display',
                              'Fast, responsive results as you type'],
            'status': 'Live',
            'url': 'https://drug-finder.vercel.app'},
        {   'name': 'Roam',
            'subtitle': 'AI Travel Agent & Trip Planner',
            'description': 'An AI-powered travel agent that turns a simple prompt into a complete '
                           'trip. Roam helps users discover destinations, build itineraries, and plan '
                           'the details through a conversational, mobile-first experience.',
            'tech_stack': ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'AI SDK', 'Vercel'],
            'highlights': [   'Conversational AI trip planning',
                              'Personalized destination recommendations',
                              'Itinerary building and organization'],
            'status': 'In Development',
            'url': ''},
        {   'name': 'Jose Madrid Salsa',
            'subtitle': 'Premium Gourmet Salsa – E-commerce & Marketing Site',
            'description': 'Modern marketing and e‑commerce experience for an Ohio‑made gourmet salsa '
                           'brand. Highlights include heat‑level guided shopping, fundraising and '
                           'wholesale pathways, and a clean, mobile‑first design deployed on Vercel.',
            'tech_stack': ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
            'highlights': [   'Heat-level browsing (Mild, Medium, Hot)',
                              'Fundraising and wholesale information flows',
                              'Responsive, performance‑optimized pages'],
            'status': 'Live',
            'url': 'https://josemadrid.net'},
        {   'name': 'Amplinks',
            'subtitle': 'Self-Hosted iOS/Web Music Platform',
            'description': 'A comprehensive self-hosted iOS/Web application for seamless music '
                           'downloading directly to iPhone as MP3 files without any user interaction. '
                           'Features a Linktree-style sharing page for real-time music streaming with '
                           'friends, integrated web music player, and full music management system.',
            'tech_stack': [   'React',
                              'React Native',
                              'Node.js',
                              'TypeScript',
                              'WebRTC',
                              'Socket.io',
                              'Swift'],
            'highlights': [   'Automatic iOS MP3 downloads with zero clicks',
                              'Linktree-style sharing pages for friends',
                              'Real-time streaming and chat with friends'],
            'status': 'In Development',
            'url': 'https://paddle-mobile-web-payments-starter-pi-nine.vercel.app'},
        {   'name': 'Zanesville.store',
            'subtitle': 'Local E-commerce Platform',
            'description': 'A comprehensive e-commerce platform designed to connect local Zanesville '
                           'businesses with customers. Features intuitive navigation, secure payment '
                           'processing, and a responsive design optimized for both desktop and mobile '
                           'shopping.',
            'tech_stack': [   'React',
                              'Next.js',
                              'TypeScript',
                              'Tailwind CSS',
                              'Node.js',
                              'MongoDB',
                              'Stripe'],
            'highlights': [   'Modern responsive design for all devices',
                              'Local business directory integration',
                              'Secure payment processing system'],
            'status': 'In Development',
            'url': 'https://pallets.sale'},
        {   'name': 'Homesh.app',
            'subtitle': 'Self-Hosted Home Dashboard',
            'description': 'A comprehensive self-hosted home dashboard for home automation enthusiasts '
                           'and privacy-conscious users. Features a modern, customizable interface for '
                           'monitoring and controlling smart home devices while keeping all data '
                           'locally stored.',
            'tech_stack': [   'React',
                              'TypeScript',
                              'Node.js',
                              'Docker',
                              'WebSockets',
                              'Chart.js',
                              'Tailwind CSS'],
            'highlights': [   'Fully self-hosted with complete data privacy',
                              'Customizable dashboard widgets and layouts',
                              'Integration with popular home automation platforms'],
            'status': 'In Development',
            'url': 'https://homesh.app'},
        {   'name': 'Apple-Sider',
            'subtitle': 'Self-Hosted Apple Music Library Downloader',
            'description': 'A 1-click self-hosted web application to download your entire Apple Music '
                           'Library using a Library.xml file. Features a clean Apple-inspired '
                           'interface with real-time progress tracking, concurrent downloads, and '
                           'automatic metadata enhancement.',
            'tech_stack': ['Python', 'Flask', 'Docker', 'WebSockets', 'yt-dlp', 'JavaScript', 'HTML5'],
            'highlights': [   'Single-page web interface with drag-and-drop',
                              'Real-time progress tracking and console output',
                              'Concurrent downloads with queue management'],
            'status': 'Live',
            'url': 'https://jordolang.github.io/Apple-Sider/'},
        {   'name': 'World Auto Net',
            'subtitle': 'Automotive Marketplace Website',
            'description': 'Modern, responsive website design for an automotive marketplace platform. '
                           'A comprehensive digital presence with intuitive navigation, advanced '
                           'search capabilities, and a mobile-first approach connecting car buyers and '
                           'sellers.',
            'tech_stack': ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'jQuery', 'PHP', 'MySQL'],
            'highlights': [   'Responsive design optimized for all devices',
                              'Vehicle inventory system with advanced filtering',
                              'Search functionality with location-based results'],
            'status': 'Live',
            'url': 'https://web.archive.org/web/20210508120122/https://www.worldautonet.com'},
        {   'name': 'Neff Paving',
            'subtitle': 'Professional Paving Services Website',
            'description': 'Complete website redesign for a professional paving contractor, featuring '
                           'modern design principles, service showcases, and lead generation '
                           'optimization focused on converting visitors into qualified leads.',
            'tech_stack': [   'HTML5',
                              'CSS3',
                              'JavaScript',
                              'WordPress',
                              'PHP',
                              'Photoshop',
                              'Illustrator'],
            'highlights': [   'Professional brand identity design',
                              'Service portfolio with before/after galleries',
                              'Mobile-responsive design'],
            'status': 'Live',
            'url': 'https://neffpaving.com'},
        {   'name': 'First Baptist Church',
            'subtitle': 'Church Community Website',
            'description': 'Comprehensive church website design focused on community engagement and '
                           'information accessibility. A welcoming digital space that reflects the '
                           "church's values while providing essential information for members and "
                           'visitors.',
            'tech_stack': ['HTML5', 'CSS3', 'JavaScript', 'WordPress', 'PHP', 'MailChimp', 'Photoshop'],
            'highlights': [   'Welcoming and accessible design',
                              'Event calendar and announcements',
                              'Sermon archive and media gallery'],
            'status': 'Live',
            'url': 'https://jordolang.github.io/First-Baptist/index.html'},
        {   'name': 'Ohio Interests',
            'subtitle': 'Local Interest & Tourism Website',
            'description': "Engaging website design showcasing Ohio's attractions, events, and local "
                           'interests. Built with tourism and local business promotion in mind, '
                           'featuring interactive maps, event listings, and resource directories.',
            'tech_stack': [   'HTML5',
                              'CSS3',
                              'JavaScript',
                              'WordPress',
                              'PHP',
                              'Google Maps API',
                              'Photoshop'],
            'highlights': [   'Interactive attraction maps',
                              'Local business directory',
                              'Event calendar and listings'],
            'status': 'Live',
            'url': 'https://web.archive.org/web/20230816090905/https://ohiointerests.com/'},
        {   'name': 'Amplinks (Mobile App)',
            'subtitle': 'Native iOS & Android Music App',
            'description': 'The native mobile companion to the Amplinks platform. Download music '
                           'straight to your phone as MP3s with zero clicks, stream in real time, and '
                           'share Linktree-style pages with friends — all from a self-hosted backend '
                           'you control.',
            'tech_stack': ['Swift', 'React Native', 'iOS', 'Android', 'WebRTC', 'Socket.io', 'Node.js'],
            'highlights': [   'Zero-click MP3 downloads to your device',
                              'Real-time streaming and listening with friends',
                              'Linktree-style sharing pages on the go'],
            'status': 'In Development',
            'url': 'https://paddle-mobile-web-payments-starter-pi-nine.vercel.app'},
        {   'name': 'Jose Madrid Salsa (Mobile App)',
            'subtitle': 'Mobile Shopping App (iOS & Android)',
            'description': 'A mobile commerce experience for the Ohio-made gourmet salsa brand. Browse '
                           'by heat level, reorder favorites in a tap, and check out fast with a '
                           'native, mobile-first storefront for iOS and Android.',
            'tech_stack': ['React Native', 'Expo', 'TypeScript', 'iOS', 'Android', 'Stripe', 'Node.js'],
            'highlights': [   'Heat-level guided browsing (Mild, Medium, Hot)',
                              'One-tap reorder and saved favorites',
                              'Native mobile checkout flow'],
            'status': 'In Development',
            'url': 'https://josemadrid.net'},
        {   'name': 'Radius (Mobile App)',
            'subtitle': 'Proximity-Based Connection App (iOS & Android)',
            'description': 'A proximity-based mobile app built around mutual consent. When two nearby '
                           'users are a potential match, each receives a discreet proximity alert and '
                           'they only connect if both opt in — turning real-world nearness into '
                           'spontaneous, consent-first introductions.',
            'tech_stack': [   'React Native',
                              'Expo',
                              'TypeScript',
                              'iOS',
                              'Android',
                              'Geolocation',
                              'WebSockets'],
            'highlights': [   'Real-time proximity detection between nearby users',
                              'Mutual opt-in — connections only form when both agree',
                              'Discreet, privacy-first proximity alerts'],
            'status': 'In Development',
            'url': ''},
        {   'name': 'Jose Madrid Salsa for Mac',
            'subtitle': 'Native macOS Business Management App',
            'description': 'Run the entire business without ever leaving your desktop. A native macOS '
                           "app that carries Jose Madrid Salsa's whole admin panel — manage orders, "
                           'manage content, and run fundraisers, events, wholesale, finances and '
                           'marketing from one keyboard-driven window. It reads the same live database '
                           'as the website, so every new admin feature lands on the desktop the day it '
                           'ships.',
            'tech_stack': ['SwiftUI', 'macOS', 'Swift', 'Next.js', 'Prisma', 'PostgreSQL'],
            'highlights': [   'Orders — every order with channel, status and totals, plus returns & '
                              'RMAs and shipping labels',
                              'Content & Blog — blog posts, pages, banners, FAQs, redirects and SEO',
                              "Dashboard — today's revenue and orders, live fundraisers, jars on hand, "
                              'reorder alerts, and the next shows'],
            'status': 'Live',
            'url': ''},
        {   'name': 'Local Lead Scraper Pro',
            'subtitle': 'Google Maps Prospecting Desktop App',
            'description': 'A licensed Windows desktop app that turns a city and an industry into a '
                           'worked lead list: scrape Google Maps listings, scan each site for '
                           'contacts, compose and send personalised outreach, and work the follow-up '
                           'calls from a prioritised cockpit.',
            'tech_stack': ['Python', 'PySide6', 'Qt', 'Selenium', 'PyInstaller'],
            'highlights': [   'Google Maps listing scraper with radius and result caps',
                              'Website crawler that pulls emails and contact details',
                              'Templated email generation and campaign sending'],
            'status': 'Live',
            'url': ''},
        {   'name': 'FestivalNet Scraper',
            'subtitle': 'Vendor Show-Finder Desktop App',
            'description': 'Finds the most profitable shows for the lowest out-of-pocket cost. It '
                           'scans every upcoming weekend within driving distance, scores each expo, '
                           "fair, and festival on what it should actually put in a vendor's pocket, "
                           'and lays the results out as a table, a map, a calendar, and four charts.',
            'tech_stack': ['Python', 'Qt', 'Requests', 'Geocoding', 'PyInstaller'],
            'highlights': [   'Scores every event on estimated profit, not just attendance',
                              'Geocoding and a drive-time radius from your home town',
                              'Results as a table, map, calendar, and four charts'],
            'status': 'Live',
            'url': ''},
        {   'name': 'Salsa Kings Self-Order Kiosk',
            'subtitle': 'Event Self-Service Kiosk for Jose Madrid Salsa',
            'description': "A self-service till for Jose Madrid Salsa's expo and festival booth. "
                           'Customers scan jars under a downward-facing barcode scanner or tap them on '
                           "screen, the kiosk applies the booth's mix-and-match deals, they pay by tap "
                           'on a Square reader, and a receipt prints. One tablet on a pole stand does '
                           'the work of a cashier.',
            'tech_stack': ['Next.js', 'React', 'TypeScript', 'Square', 'Swift', 'Kotlin', 'Prisma'],
            'highlights': [   'Scan jars with a hands-free USB barcode scanner, or tap them on screen',
                              'Booth deals (3 for $25, 4 for $32, 5 + chips for $40, case of 12) '
                              'priced server-side',
                              'Card payments through Square Terminal or a Square Reader on the iPad'],
            'status': 'In Development',
            'url': ''},
        {   'name': 'CLI Music Downloader',
            'subtitle': 'Command-Line Music Tool',
            'description': 'Professional command-line tool for downloading music with high-quality '
                           'metadata enhancement. Includes MusicBrainz API integration, album art '
                           'processing, and comprehensive error handling.',
            'tech_stack': ['Python', 'MusicBrainz API', 'Mutagen', 'Shell Scripting'],
            'highlights': [   'Metadata enhancement',
                              'Multi-source integration',
                              'Professional documentation'],
            'status': 'Live',
            'url': ''},
        {   'name': 'Interactive Terminal Portfolio',
            'subtitle': 'This CLI Resume',
            'description': 'This very portfolio! A modular Python script showcasing professional '
                           'experience through an interactive command-line interface with colored '
                           'output and typewriter effects.',
            'tech_stack': ['Python', 'Terminal UI', 'ASCII Art', 'Color Formatting'],
            'highlights': [   'Modular architecture',
                              'Interactive navigation',
                              'Professional presentation'],
            'status': 'Live',
            'url': 'https://jlang.dev/api/resume'}]


def show_project_card(project: Dict, index: int):
    """Display a formatted project card."""
    status_colors = {
        "Live": Colors.OKGREEN,
        "Completed": Colors.OKGREEN,
        "Active": Colors.OKBLUE,
        "In Development": Colors.WARNING,
        "Planning": Colors.PURPLE,
        "Concept": Colors.CYAN
    }
    
    status_color = status_colors.get(project["status"], Colors.ENDC)
    
    print(f"{Colors.BOLD}【 {index + 1}. {project['name']} 】{Colors.ENDC}")
    if project.get("subtitle"):
        print(f"{Colors.CYAN}├─ {project['subtitle']}{Colors.ENDC}")
    print(f"{Colors.CYAN}└─ Status: {status_color}{project['status']}{Colors.ENDC}")
    print(f"\n{Colors.OKGREEN}Description:{Colors.ENDC}")
    print(f"  {project['description']}")
    
    print(f"\n{Colors.HEADER}Tech Stack:{Colors.ENDC}")
    tech_display = " • ".join(project['tech_stack'])
    print(f"  🔧 {tech_display}")
    
    print(f"\n{Colors.WARNING}Key Highlights:{Colors.ENDC}")
    for highlight in project['highlights']:
        print(f"  ⭐ {highlight}")

    if project.get("url"):
        print(f"\n  🔗 {project['url']}")
    
    print(f"{Colors.CYAN}" + "─" * 80 + f"{Colors.ENDC}\n")


def show_projects():
    """Display the projects section with featured projects."""
    clear_screen()
    print_section_header("FEATURED PROJECTS PORTFOLIO")
    
    projects = get_featured_projects()
    
    print(f"{Colors.BOLD}Here are {len(projects)} featured projects showcasing my technical expertise:{Colors.ENDC}\n")
    
    for i, project in enumerate(projects):
        show_project_card(project, i)
    
    print(f"{Colors.HEADER}💡 Project Insights:{Colors.ENDC}")
    print(f"• Each project demonstrates different aspects of full-stack development")
    print(f"• Technologies range from modern web frameworks to command-line tools")
    print(f"• Focus on user experience, performance, and maintainable code")
    print(f"• Emphasis on professional documentation and testing")
    
    print(f"\n{Colors.WARNING}🚀 Want to discuss any of these projects? Use the contact section!{Colors.ENDC}")


# ============================================================================
# CONTACT SECTION
# ============================================================================

def show_contact():
    """Display contact information and call-to-action."""
    clear_screen()
    print_section_header("GET IN TOUCH")
    
    contact_ascii = f"""{Colors.CYAN}
    📧 Let's Connect!
    ═══════════════════════════════════════════════════════════════════════════════
{Colors.ENDC}"""
    print(contact_ascii)
    
    print(f"{Colors.BOLD}Ready to collaborate? I'd love to hear from you!{Colors.ENDC}\n")
    
    contact_methods = [
        ("📧 Email", "jordan@jlang.dev", "Primary contact method"),
        ("💼 LinkedIn", "linkedin.com/in/jordolang", "Professional networking"),
        ("🐙 GitHub", "github.com/jordolang", "Code repositories and projects"),
        ("🐦 Twitter", "@jordolang", "Tech discussions and updates"),
        ("📱 Phone", "+1(220)241-0095", "Available during business hours")
    ]
    
    print(f"{Colors.HEADER}Contact Methods:{Colors.ENDC}")
    for icon_method, contact_info, description in contact_methods:
        print(f"{Colors.OKGREEN}{icon_method}:{Colors.ENDC}")
        print(f"  {Colors.BOLD}{contact_info}{Colors.ENDC}")
        print(f"  {Colors.CYAN}└─ {description}{Colors.ENDC}\n")
    
    print_border(80, '─')
    
    print(f"\n{Colors.HEADER}🤝 What I'm Looking For:{Colors.ENDC}")
    opportunities = [
        "Full-time positions in full-stack development",
        "Freelance projects and consulting opportunities", 
        "Collaboration on open-source projects",
        "Technical mentorship and knowledge sharing",
        "Speaking engagements at tech events"
    ]
    
    for opportunity in opportunities:
        print(f"  {Colors.OKBLUE}▶{Colors.ENDC} {opportunity}")
    
    print(f"\n{Colors.WARNING}💡 Call to Action:{Colors.ENDC}")
    print(f"Have an interesting project or opportunity? Let's discuss how we can work together!")
    print(f"I respond to all messages within 24 hours. {Colors.OKGREEN}I'm excited to connect!{Colors.ENDC}")
    
    print(f"\n{Colors.CYAN}{'═' * 80}{Colors.ENDC}")
    

# ============================================================================
# BONUS EXTRAS SECTION
# ============================================================================

def show_system_info():
    """Display current system information."""
    import platform
    import sys
    
    print(f"{Colors.HEADER}🖥️ System Information:{Colors.ENDC}")
    info = [
        ("Operating System", platform.system() + " " + platform.release()),
        ("Python Version", sys.version.split()[0]),
        ("Architecture", platform.architecture()[0]),
        ("Processor", platform.processor() or "Unknown"),
        ("Current Time", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    ]
    
    for label, value in info:
        print(f"  {Colors.CYAN}{label}:{Colors.ENDC} {value}")


def show_color_test():
    """Display a color test for terminal compatibility."""
    print(f"\n{Colors.HEADER}🎨 Color Test:{Colors.ENDC}")
    colors = [
        (Colors.RED, "Red"), (Colors.GREEN, "Green"), (Colors.BLUE, "Blue"),
        (Colors.YELLOW, "Yellow"), (Colors.PURPLE, "Purple"), (Colors.CYAN, "Cyan")
    ]
    
    for color, name in colors:
        print(f"  {color}■{Colors.ENDC} {name} ")


def run_network_test():
    """Simple network connectivity test."""
    print(f"\n{Colors.HEADER}🌐 Network Test:{Colors.ENDC}")
    try:
        import urllib.request
        response = urllib.request.urlopen('https://httpbin.org/status/200', timeout=5)
        if response.getcode() == 200:
            print(f"  {Colors.OKGREEN}✓ Internet connectivity: OK{Colors.ENDC}")
        else:
            print(f"  {Colors.WARNING}⚠ Internet connectivity: Limited{Colors.ENDC}")
    except Exception:
        print(f"  {Colors.FAIL}✗ Internet connectivity: Failed{Colors.ENDC}")


def show_bonus_extras():
    """Display bonus utilities and diagnostic tools."""
    clear_screen()
    print_section_header("BONUS EXTRAS & UTILITIES")
    
    print(f"{Colors.BOLD}Welcome to the utility section! Here are some diagnostic tools:{Colors.ENDC}\n")
    
    show_system_info()
    show_color_test()
    run_network_test()
    
    print(f"\n{Colors.HEADER}🛠️ Available Utilities:{Colors.ENDC}")
    utilities = [
        ("System Diagnostics", "Basic system information and status"),
        ("Color Compatibility Test", "Terminal color support verification"),
        ("Network Connectivity Check", "Internet connection validation"),
        ("Performance Metrics", "Coming soon - system performance stats"),
        ("Environment Variables", "Coming soon - env var inspection"),
        ("Git Repository Status", "Coming soon - git status checker")
    ]
    
    for utility, description in utilities:
        status = Colors.OKGREEN + "✓" if "Coming soon" not in description else Colors.WARNING + "⏳"
        print(f"  {status}{Colors.ENDC} {Colors.BOLD}{utility}{Colors.ENDC}")
        print(f"    {Colors.CYAN}└─ {description}{Colors.ENDC}")
    
    print(f"\n{Colors.WARNING}💡 Future Enhancements:{Colors.ENDC}")
    print("This section is designed to be modular and extensible.")
    print("Additional utilities and scripts can be easily added to enhance functionality.")


# ============================================================================
# MAIN MENU & NAVIGATION
# ============================================================================

def show_main_menu():
    """Display the main navigation menu."""
    clear_screen()
    print_section_header("MAIN MENU")
    
    menu_items = [
        ("1", "introduction", "Welcome & Bio", "Get to know me and my background"),
        ("2", "resume", "Skills & Experience", "Technical skills and professional journey"),
        ("3", "projects", "Featured Projects", "Portfolio of completed and ongoing work"),
        ("4", "contact", "Contact Information", "Get in touch for opportunities"),
        ("5", "extras", "Bonus Utilities", "Diagnostic tools and extras"),
        ("q", "quit", "Exit Portfolio", "Thanks for visiting!")
    ]
    
    print(f"{Colors.BOLD}Choose a section to explore:{Colors.ENDC}\n")
    
    for key, command, title, description in menu_items:
        color = Colors.FAIL if command == "quit" else Colors.OKGREEN
        print(f"  {color}{key}.{Colors.ENDC} {Colors.BOLD}{title}{Colors.ENDC}")
        print(f"     {Colors.CYAN}└─ {description}{Colors.ENDC}")
        print(f"     {Colors.WARNING}Command: '{command}' or '{command[0]}'{Colors.ENDC}\n")


def get_user_input() -> str:
    """Get user input with colored prompt."""
    prompt = f"\n{Colors.BOLD}portfolio:{Colors.OKBLUE}~${Colors.ENDC} "
    return input(prompt).strip().lower()


def show_section_navigation_footer():
    """Display consistent navigation footer for all sections."""
    print(f"\n{Colors.CYAN}{'═' * 80}{Colors.ENDC}")
    print(f"{Colors.BOLD}🔄 Navigation Options:{Colors.ENDC}")
    print(f"  {Colors.OKGREEN}[Enter/Space]{Colors.ENDC} - Return to Main Menu")
    print(f"  {Colors.OKGREEN}['m']{Colors.ENDC} - Jump to Main Menu")
    print(f"  {Colors.OKGREEN}['h']{Colors.ENDC} - Show Help")
    print(f"  {Colors.OKGREEN}['q'/ESC]{Colors.ENDC} - Quit Portfolio")
    print(f"{Colors.CYAN}{'═' * 80}{Colors.ENDC}")
    print(f"{Colors.WARNING}Choose your action: {Colors.ENDC}", end="")


def handle_section_navigation() -> str:
    """Handle navigation input from within a section."""
    while True:
        try:
            key = get_single_keypress()
            action, _ = validate_input(key, 6)  # Max 6 for main menu items
            
            if action in ['ENTER', 'MENU'] or key in [' ', '\r', '\n']:
                return 'MENU'
            elif action == 'HELP':
                show_help_overlay()
                return 'HELP_SHOWN'  # Special return to redisplay section
            elif action == 'QUIT':
                return 'QUIT'
            elif action == 'INVALID':
                print(f"\n{Colors.WARNING}⚠ Invalid input: '{key}'. Try again or press 'h' for help.{Colors.ENDC}")
                continue
                
        except KeyboardInterrupt:
            return 'QUIT'


def show_section_with_navigation(section_func: Callable, section_name: str):
    """Display a section with enhanced navigation options."""
    while True:
        # Clear screen and show section content
        section_func()
        
        # Show navigation footer
        show_section_navigation_footer()
        
        # Handle user navigation choice
        nav_choice = handle_section_navigation()
        
        if nav_choice == 'MENU':
            break
        elif nav_choice == 'QUIT':
            # Propagate quit signal up
            raise KeyboardInterrupt
        elif nav_choice == 'HELP_SHOWN':
            continue  # Redisplay the section
        # For other cases, continue the loop


def show_welcome_screen():
    """Display initial welcome screen with enhanced introduction."""
    clear_screen()
    show_ascii_art()
    
    print_section_header("WELCOME TO MY INTERACTIVE PORTFOLIO")
    print(f"{Colors.BOLD}👋 Hello! I'm Jordan Lang{Colors.ENDC}")
    print(f"{Colors.OKGREEN}Full-Stack Developer | Problem Solver | Tech Enthusiast{Colors.ENDC}\n")
    
    welcome_text = f"""
{Colors.CYAN}🌟 Interactive Portfolio Features:{Colors.ENDC}
  • Navigate with arrow keys (↑/↓) or vim keys (j/k)
  • Use number keys (1-5) for direct section access
  • Press 'h' anytime for help, 'q' to quit, 'm' for menu
  • Comprehensive error handling and input validation
  • Smooth transitions between sections

{Colors.WARNING}💡 Pro Tip:{Colors.ENDC} This portfolio demonstrates both my technical skills 
and attention to user experience design!
"""
    
    typewriter_effect(welcome_text, 0.02)
    
    print(f"{Colors.HEADER}Ready to explore? Let's get started!{Colors.ENDC}")
    print(f"{Colors.CYAN}Press any key to continue to the main menu...{Colors.ENDC}")
    

def show_exit_screen():
    """Display graceful exit screen with contact reminder."""
    clear_screen()
    
    exit_art = f"""{Colors.CYAN}
    ╔═══════════════════════════════════════════════════════════════════════════╗
    ║                     Thanks for visiting my portfolio!                     ║
    ╚═══════════════════════════════════════════════════════════════════════════╝
{Colors.ENDC}"""
    
    print(exit_art)
    print(f"\n{Colors.BOLD}Jordan Lang - Full-Stack Developer{Colors.ENDC}")
    print(f"{Colors.OKGREEN}Feel free to reach out anytime: jordan@jlang.dev{Colors.ENDC}")
    print(f"{Colors.CYAN}GitHub: github.com/jordolang | LinkedIn: linkedin.com/in/jordolang{Colors.ENDC}\n")
    
    print(f"{Colors.WARNING}💼 Remember:{Colors.ENDC} Great code is just the beginning - let's build something amazing together!")
    print(f"{Colors.HEADER}Have a fantastic day! 👋{Colors.ENDC}\n")


def main():
    """Enhanced main program loop with comprehensive navigation."""
    # Menu structure: (icon, name, description, function)
    menu_items = [
        ("👋", "Introduction", "Welcome & Bio - Get to know me and my background", show_introduction),
        ("📋", "Resume", "Skills & Experience - Technical skills and professional journey", show_resume),
        ("💼", "Projects", "Featured Projects - Portfolio of completed and ongoing work", show_projects),
        ("📧", "Contact", "Contact Information - Get in touch for opportunities", show_contact),
        ("🛠️", "Utilities", "Bonus Extras - Diagnostic tools and system utilities", show_bonus_extras),
        ("❌", "Exit", "Quit Portfolio - Thanks for visiting!", None)
    ]
    
    # Show initial welcome screen
    show_welcome_screen()
    
    # Check if we can get any input at all - if not, show a demo mode
    try:
        # Try to detect if input is available
        if not sys.stdin.isatty():
            # Non-interactive mode detected - show demo and exit
            print(f"\n{Colors.WARNING}🎭 Demo Mode: Non-interactive environment detected.{Colors.ENDC}")
            print(f"{Colors.CYAN}This would normally wait for your input to continue.{Colors.ENDC}")
            print(f"{Colors.OKGREEN}In a real terminal, you'd press any key to explore the interactive portfolio!{Colors.ENDC}")
            print(f"\n{Colors.HEADER}✨ Portfolio Features Preview:{Colors.ENDC}")
            print(f"  • Interactive navigation with arrow keys")
            print(f"  • Multiple sections: Introduction, Resume, Projects, Contact")
            print(f"  • Comprehensive keyboard shortcuts and help system")
            print(f"  • Professional presentation with colors and ASCII art")
            print(f"\n{Colors.WARNING}💡 To experience the full interactive portfolio:{Colors.ENDC}")
            print(f"  • Run directly: python3 portfolio.py")
            print(f"  • Or use: ./launch.sh (downloads and runs)")
            print(f"  • Avoid piping to maintain terminal interaction")
            
            time.sleep(2)  # Brief pause so users can read
            
            # Show exit message without clearing screen
            print(f"\n{Colors.CYAN}{'═' * 80}{Colors.ENDC}")
            print(f"{Colors.BOLD}Jordan Lang - Full-Stack Developer{Colors.ENDC}")
            print(f"{Colors.OKGREEN}Feel free to reach out anytime: jordan@jlang.dev{Colors.ENDC}")
            print(f"{Colors.CYAN}GitHub: github.com/jordolang | LinkedIn: linkedin.com/in/jordolang{Colors.ENDC}")
            print(f"\n{Colors.WARNING}💼 Remember:{Colors.ENDC} Great code is just the beginning - let's build something amazing together!")
            print(f"{Colors.HEADER}Have a fantastic day! 👋{Colors.ENDC}")
            return
        
        result = get_single_keypress()
        if result == 'ESC':
            show_exit_screen()
            return
    except KeyboardInterrupt:
        show_exit_screen()
        return
    
    # Main navigation loop with enhanced error handling
    while True:
        try:
            # Prepare menu items for navigation (icon, name, description)
            nav_items = [(item[0], item[1], item[2]) for item in menu_items]
            
            # Show navigation menu and get selection
            selected_index = navigate_menu(nav_items, "PORTFOLIO NAVIGATION")
            
            # Handle user selection
            if selected_index == -1:  # User pressed 'q', ESC, or Ctrl+C
                break
            elif selected_index == -2:  # Special return to menu code
                continue  # Stay in main loop
            elif selected_index == len(menu_items) - 1:  # Exit option
                break
            else:
                # Execute the selected section with error handling
                section_func = menu_items[selected_index][3]
                section_name = menu_items[selected_index][1]
                
                if section_func:  # Ensure function exists
                    show_section_with_navigation(section_func, section_name)
        
        except KeyboardInterrupt:
            # Graceful handling of Ctrl+C
            break
        except Exception as e:
            # Comprehensive error handling
            clear_screen()
            print(f"{Colors.FAIL}{'═' * 60}{Colors.ENDC}")
            print(f"{Colors.FAIL}🚨 An unexpected error occurred:{Colors.ENDC}")
            print(f"{Colors.FAIL}{'═' * 60}{Colors.ENDC}")
            print(f"{Colors.WARNING}Error Details: {str(e)}{Colors.ENDC}\n")
            
            print(f"{Colors.CYAN}Don't worry! This doesn't affect the core functionality.{Colors.ENDC}")
            print(f"{Colors.OKGREEN}Options:{Colors.ENDC}")
            print(f"  • Press 'Enter' to return to the main menu")
            print(f"  • Press 'q' to quit safely")
            print(f"  • Press 'h' for help")
            
            try:
                error_key = get_single_keypress()
                if error_key.lower() == 'q':
                    break
                elif error_key.lower() == 'h':
                    show_help_overlay()
                # For any other key, continue to main menu
            except KeyboardInterrupt:
                break
    
    # Graceful exit
    show_exit_screen()


if __name__ == "__main__":
    main()
