export interface IconCategory {
  name: string;
  icons: string[];
}

export const ICON_CATEGORIES: IconCategory[] = [
  {
    name: "Esenciales",
    icons: ["Heart", "Star", "Check", "X", "Plus", "Minus", "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "ChevronRight", "ChevronDown", "ExternalLink", "Search", "Settings", "Home", "User", "Mail", "Phone", "MapPin"]
  },
  {
    name: "Negocios",
    icons: ["TrendingUp", "TrendingDown", "BarChart3", "PieChart", "DollarSign", "CreditCard", "Briefcase", "Building2", "Target", "Award", "Trophy", "Handshake", "Presentation", "FileText", "Clipboard", "Calculator"]
  },
  {
    name: "Tecnologia",
    icons: ["Monitor", "Smartphone", "Tablet", "Laptop", "Wifi", "Cloud", "Database", "Server", "Code", "Terminal", "Cpu", "Globe", "Lock", "Shield", "Key", "Zap"]
  },
  {
    name: "Creatividad",
    icons: ["Palette", "Paintbrush", "Pen", "Camera", "Video", "Music", "Headphones", "Image", "Layers", "Figma", "Sparkles", "Wand2", "Lightbulb", "Flame", "Rainbow", "Eye"]
  },
  {
    name: "Naturaleza",
    icons: ["Sun", "Moon", "CloudSun", "Snowflake", "Droplets", "Wind", "Mountain", "Trees", "Flower2", "Leaf", "Bug", "Bird", "Fish", "Paw"]
  },
  {
    name: "Social",
    icons: ["MessageCircle", "MessageSquare", "Share2", "ThumbsUp", "ThumbsDown", "Users", "UserPlus", "Bell", "AtSign", "Hash", "Link", "Bookmark", "Flag", "Gift"]
  },
  {
    name: "Flechas y Formas",
    icons: ["MoveRight", "MoveUpRight", "CornerDownRight", "ArrowBigRight", "ArrowBigUp", "Circle", "Square", "Triangle", "Hexagon", "Pentagon", "Octagon", "Diamond"]
  },
  {
    name: "Educacion",
    icons: ["BookOpen", "GraduationCap", "School", "Library", "Microscope", "FlaskConical", "Atom", "Brain", "PenTool", "Ruler", "Compass", "Clock"]
  }
];

export const ALL_ICON_NAMES = ICON_CATEGORIES.flatMap(c => c.icons);
