# Select node package version 22
FROM node:22

# Setup /app as working directory in docker container 
WORKDIR /app

# Copy all package requirement to container root directory
COPY package.json .

# Install all the requirement 
RUN npm install

# Copy the remaining files to docker directory
COPY . .

## Initilize prisma database
RUN npx prisma generate

# Run application
CMD ["npm", "run", "dev"]

