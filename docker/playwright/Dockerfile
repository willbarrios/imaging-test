#Running basic image with Node.js
FROM node:20-bookworm

# Set the working directory in the container
WORKDIR /imaging-playwright

# Copy package.json and package-lock.json
COPY package*.json ./

#Install dependencies in package.json
RUN npm install
#Install playwright
RUN npx playwright install
RUN npx playwright install-deps

# Copy the rest of the application code
COPY . .

#Run the tests once the container is running
CMD ["npx", "playwright", "test", "routing.spec.ts"]