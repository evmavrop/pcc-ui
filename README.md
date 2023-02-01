# PCC-UI

A ReactJS application for the PID Central Catalogue (PCC)

## Configuration

The pcc-ui application provides a simple way to configure connection through the `config.js` file. Before using just set the `endpoint` parameter appropriately.

The `public` directory of the project may host specific assets such as the `favicon.ico` and the `logo.svg`.

## Installation

### Development mode

1. `git clone https://github.com/ARGOeu/pcc-ui.git`
2. `cd pcc-ui`
3. `npm install`
4. `npm start`

This will run the app in the development mode.Open http://localhost:3000 to view it in your browser.
 
The page will reload when you make changes.
You may also see any lint errors in the console.

### Production mode

1. `git clone https://github.com/ARGOeu/pcc-ui.git`
2. `cd pcc-ui`
3. `npm install`
4. `npm run build`

This will build the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
