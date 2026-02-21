export type Theme = {
  name: string;
  colors: {
    [key: string]: string;
  };
};

export const themes: Theme[] = [
  {
    name: 'Midnight Glow',
    colors: {
      '--background': '224 71% 4%',
      '--foreground': '210 20% 98%',
      '--primary': '204 100% 50%',
      '--primary-foreground': '224 71% 4%',
      '--card': '224 71% 9%',
      '--card-foreground': '210 20% 98%',
      '--accent': '204 100% 50%',
      '--border': '215 28% 17%',
    },
  },
  {
    name: 'Crimson Tide',
    colors: {
      '--background': '0 0% 8%',
      '--foreground': '0 0% 98%',
      '--primary': '347 97% 52%',
      '--primary-foreground': '0 0% 98%',
      '--card': '0 0% 12%',
      '--card-foreground': '0 0% 98%',
      '--accent': '347 97% 52%',
      '--border': '0 0% 20%',
    },
  },
  {
    name: 'Emerald Forest',
    colors: {
      '--background': '148 60% 8%',
      '--foreground': '148 20% 95%',
      '--primary': '148 80% 40%',
      '--primary-foreground': '148 20% 98%',
      '--card': '148 60% 12%',
      '--card-foreground': '148 20% 95%',
      '--accent': '148 80% 40%',
      '--border': '148 60% 20%',
    },
  },
  {
    name: 'Golden Hour',
    colors: {
      '--background': '24 50% 10%',
      '--foreground': '34 20% 95%',
      '--primary': '44 98% 50%',
      '--primary-foreground': '24 50% 10%',
      '--card': '24 50% 14%',
      '--card-foreground': '34 20% 95%',
      '--accent': '44 98% 50%',
      '--border': '24 50% 22%',
    },
  },
  {
    name: 'Arctic Dawn',
    colors: {
      '--background': '210 40% 98%',
      '--foreground': '222.2 84% 4.9%',
      '--primary': '217.2 91.2% 59.8%',
      '--primary-foreground': '210 40% 98%',
      '--card': '0 0% 100%',
      '--card-foreground': '222.2 84% 4.9%',
      '--accent': '217.2 91.2% 59.8%',
      '--border': '214.3 31.8% 91.4%',
    },
  },
  {
    name: 'Amethyst Haze',
    colors: {
      '--background': '262 64% 12%',
      '--foreground': '262 30% 95%',
      '--primary': '262 84% 60%',
      '--primary-foreground': '262 30% 98%',
      '--card': '262 64% 16%',
      '--card-foreground': '262 30% 95%',
      '--accent': '262 84% 60%',
      '--border': '262 64% 24%',
    },
  },
  {
    name: 'Desert Mirage',
    colors: {
      '--background': '38 92% 95%',
      '--foreground': '38 40% 8%',
      '--primary': '28 87% 53%',
      '--primary-foreground': '38 92% 98%',
      '--card': '38 92% 98%',
      '--card-foreground': '38 40% 8%',
      '--accent': '28 87% 53%',
      '--border': '38 80% 85%',
    },
  },
];
