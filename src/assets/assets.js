// Beats by Dre Website Assets
// All images organized by categories from the assets folder

export const assets = {
  hero: [
    {
      id: 1,
      title: 'Beats by Dre Hero',
      imageUrl: '/src/assets/Heroimg/heroimg.jpg',
      category: 'hero',
      altText: 'Beats by Dre hero image',
      order: 1
    }
  ],
  headphones: [
    {
      id: 2,
      title: 'Android Black Headset',
      imageUrl: '/src/assets/Headset/Android_black.png',
      category: 'headphones',
      altText: 'Beats Android Black Headset',
      order: 1
    },
    {
      id: 3,
      title: 'Apple Music Headset',
      imageUrl: '/src/assets/Headset/Apple_music.jpg',
      category: 'headphones',
      altText: 'Beats Apple Music Headset',
      order: 2
    },
    {
      id: 4,
      title: 'Black Headset',
      imageUrl: '/src/assets/Headset/headset_black.png',
      category: 'headphones',
      altText: 'Beats Black Headset',
      order: 3
    },
    {
      id: 5,
      title: 'White Headset',
      imageUrl: '/src/assets/Headset/headset_white.jpg',
      category: 'headphones',
      altText: 'Beats White Headset',
      order: 4
    },
    {
      id: 6,
      title: 'Wired Blue Headset',
      imageUrl: '/src/assets/Headset/Wiredheadset_blue.png',
      category: 'headphones',
      altText: 'Beats Wired Blue Headset',
      order: 5
    },
    {
      id: 7,
      title: 'Black Earbuds from Earbuds folder',
      imageUrl: '/src/assets/Earbuds/headset_black.jpg',
      category: 'headphones',
      altText: 'Beats Black Headset (Earbuds category)',
      order: 6
    }
  ],
  earbuds: [
    {
      id: 8,
      title: 'Bluetooth Wood',
      imageUrl: '/src/assets/Earbuds/Bluetooth_wood.jpg',
      category: 'earbuds',
      altText: 'Beats Bluetooth Wood Earbuds',
      order: 1
    },
    {
      id: 9,
      title: 'Brown Earbuds',
      imageUrl: '/src/assets/Earbuds/earbuds_brown.jpg',
      category: 'earbuds',
      altText: 'Beats Brown Earbuds',
      order: 2
    },
    {
      id: 10,
      title: 'Grey Earbuds',
      imageUrl: '/src/assets/Earbuds/earbuds_greypg.jpg',
      category: 'earbuds',
      altText: 'Beats Grey Earbuds',
      order: 3
    }
  ],
  speakers: [
    {
      id: 11,
      title: 'Bluetooth & Headset',
      imageUrl: '/src/assets/homepage/bluetooth&heaset.png',
      category: 'speakers',
      altText: 'Beats Bluetooth Speaker',
      order: 1
    }
  ],
  accessories: [
    {
      id: 12,
      title: 'Beats Image',
      imageUrl: '/src/assets/homepage/beatsimg.jpg',
      category: 'accessories',
      altText: 'Beats Accessory Image',
      order: 1
    },
    {
      id: 13,
      title: 'Gift',
      imageUrl: '/src/assets/homepage/gift.jpg',
      category: 'accessories',
      altText: 'Beats Gift Accessory',
      order: 2
    }
  ],
  logo: [
    {
      id: 16,
      title: 'Beats Logo',
      imageUrl: '/src/assets/logo/logo.png',
      category: 'logo',
      altText: 'Beats by Dre Logo',
      order: 1
    }
  ]
};

// Utility functions
export const getImagesByCategory = (category) => {
  return assets[category] || [];
};

export const getAllImages = () => {
  return Object.values(assets).flat();
};

export const getHeroImages = () => {
  return assets.hero || [];
};

export const getProductImages = () => {
  return [...assets.headphones, ...assets.earbuds, ...assets.speakers];
};

export const getAccessoryImages = () => {
  return assets.accessories || [];
};

export const getLogo = () => {
  return assets.logo ? assets.logo[0] : null;
};