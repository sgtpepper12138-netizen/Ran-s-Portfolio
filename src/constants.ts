export interface Project {
  id: number;
  title: { en: string; zh: string };
  category: { en: string; zh: string };
  image: string;
  description: { en: string; zh: string };
}

export const CONTENT = {
  nav: {
    work: { en: "Work", zh: "作品" },
    about: { en: "About", zh: "关于" },
    contact: { en: "Contact", zh: "联系" },
  },
  hero: {
    title: { en: "Digital Designer & Visual Storyteller", zh: "数字设计师 & 视觉叙事者" },
    subtitle: { en: "Crafting immersive digital experiences with a focus on aesthetics and functionality.", zh: "专注于美学与功能的沉浸式数字体验创作。" },
    cta: { en: "View Projects", zh: "查看作品" },
  },
  about: {
    title: { en: "About Me", zh: "关于我" },
    text: { 
      en: "I am a multidisciplinary designer based in the digital realm. With over 5 years of experience, I specialize in UI/UX design, brand identity, and motion graphics.",
      zh: "我是一名活跃在数字领域的跨学科设计师。拥有超过5年的经验，专注于 UI/UX 设计、品牌识别和动态图形。"
    },
  },
  projects: [
    {
      id: 1,
      title: { en: "Lumina Brand Identity", zh: "Lumina 品牌识别" },
      category: { en: "Branding", zh: "品牌设计" },
      image: "https://picsum.photos/seed/lumina/1200/800",
      description: { en: "A complete visual identity system for a sustainable energy startup.", zh: "为一家可持续能源初创公司打造的完整视觉识别系统。" }
    },
    {
      id: 2,
      title: { en: "Nebula Mobile App", zh: "Nebula 移动应用" },
      category: { en: "UI/UX Design", zh: "线下设计" },
      image: "https://picsum.photos/seed/nebula/1200/800",
      description: { en: "A futuristic social networking app focused on privacy and speed.", zh: "一款专注于隐私和速度的未来派社交网络应用。" }
    },
    {
      id: 3,
      title: { en: "Ether Editorial", zh: "Ether 编辑设计" },
      category: { en: "Print", zh: "平面印刷" },
      image: "https://picsum.photos/seed/ether/1200/800",
      description: { en: "A high-end fashion magazine layout exploring digital textures.", zh: "探索数字纹理的高端时尚杂志排版设计。" }
    },
    {
      id: 4,
      title: { en: "Zenith Watch Configurator", zh: "Zenith 手表配置器" },
      category: { en: "Web Design", zh: "网页设计" },
      image: "https://picsum.photos/seed/zenith/1200/800",
      description: { en: "An interactive 3D web experience for luxury watch customization.", zh: "用于奢华手表定制的交互式 3D 网页体验。" }
    }
  ],
  contact: {
    title: { en: "Let's Create Together", zh: "让我们共同创造" },
    email: "hello@aura.design",
    socials: [
      { name: "Dribbble", url: "#" },
      { name: "Behance", url: "#" },
      { name: "Instagram", url: "#" }
    ]
  }
};
