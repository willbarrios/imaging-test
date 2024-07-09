#Running basic image with Node.js
FROM node:20-bookworm

# Set the working directory in the container
WORKDIR /imaging-playwright
# Copy the current directory contents into the container at /imaging_playwright
COPY . .

#Install dependencies in package.json
RUN npm install

#Run the tests once the container is running
CMD ["npx", "playwright", "test", "./tests/regression/routing-specs.ts"]