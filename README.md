# Pulpo Technical Challenge

This project retrieves data from the Openaid API and returns the total monetary aid sent to a specific country over the past 5 years. The data is grouped by year and sorted in descending order by the total amount contributed. The results are returned in JSON format.

## Prerequisites

- Node.js installed on your machine
- An API key for the Openaid API

## Installation

1. Clone the repository to your local machine
2. Navigate to the project directory
3. Install dependencies by running npm install

## Usage

The project has two options for running: CLI and Web.

### CLI Option
To run the project using the CLI, use the following command:

`npm run data <countryCode>`
Replace <countryCode> with the code for the country you want to retrieve data for (e.g. SD for Sudan).

### Web Option
To run the project using the Web option, use the following command:

`npm run start`
This will start a web server on port 3000. To retrieve data for a specific country, navigate to http://localhost:3000/:countryCode. Replace :countryCode with the code for the country you want to retrieve data for (e.g. SD for Sudan).

## API Key Configuration
To use the Openaid API, you'll need an API key. You can obtain one by creating an account on the Openaid Developer Portal.

To configure your API key, create a .env file in the root directory of the project with the following contents:

API_KEY=<your-api-key>

## License
This project is licensed under the MIT License. See the LICENSE file for details.
