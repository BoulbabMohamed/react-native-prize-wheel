# React Native Prize Wheel 🎡

A modern, customizable prize wheel (wheel of fortune) component for React Native and Expo applications. This project offers a smooth spinning animation with gesture controls, perfect for gamification, contests, and interactive events.

![Prize Wheel Demo](https://github.com/user-attachments/assets/0985ca86-4321-4650-80be-bc57f4f2e1d1)

## Features ✨

- Smooth spinning animation with realistic physics
- Gesture-based interaction (swipe to spin)
- Customizable wheel segments and prizes
- Built-in user registration modal
- Winner congratulations modal
- Backend integration ready
- Responsive design (works on various screen sizes)
- Compatible with latest Expo and React Native versions
- Custom fonts support
- Background image support

## Prerequisites 📋

- Node.js
- Expo CLI
- React Native development environment

## Installation 🚀

1. Clone the repository:
```bash
git clone https://github.com/BoulbabMohamed/react-native-prize-wheel.git
cd react-native-prize-wheel
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

## Dependencies 📦

- expo
- react-native
- react-native-svg
- d3-shape
- react-native-gesture-handler
- @popmotion/popcorn
- axios
- expo-font

## Configuration ⚙️

1. Update the API endpoint, for registering users and saving the prize if you want:
```javascript
const API_LINK = "YOUR_API_ENDPOINT";
```

2. Customize wheel segments:
```javascript
const segments = [
  "Prize 1\n1000",
  "Prize 2\n50",
  "Prize 3",
  // Add or modify prizes
];
```

3. Modify wheel colors:
```javascript
const colors = [
  "#ff160e",
  "#3498DB",
  "#28B463",
  // Add or modify colors
];
```

## Features to Add 🛠️

- [ ] Configurable wheel size
- [ ] Custom styling props
- [ ] More animation options
- [ ] Sound effects
- [ ] Offline mode
- [ ] Analytics integration


## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Special thanks to Anthropic's Claude AI for assistance in creating this project and documentation
- Inspired by the need for a modern, reliable prize wheel component in React Native
- Built with Expo and React Native

## Support 💪

If you find any issues or have questions, please open an issue in the GitHub repository.

---

Created with ❤️ for the React Native community
