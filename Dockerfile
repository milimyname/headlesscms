# Use a smaller base image if possible, such as the alpine version which is much smaller in size
FROM oven/bun:alpine

# Set the working directory to /app
WORKDIR /app

# Copy only the package.json and package-lock.json (if available) first.
# This takes advantage of Docker's layer caching, so npm install is only rerun when these files change.
COPY package.json bun.lockb package-lock.json* ./

# Install dependencies
RUN bun install


# Copy the rest of your code
COPY . .


ENV VITE_POCKETBASE_URL="https://mili-lifets-pocketbase.fly.dev/"


# Build your application
RUN bun run build

# You don't need to expose a port if you're not going to run the container as a standalone service
EXPOSE 3000

# Use the CMD command instead of ENTRYPOINT to set the default executable for the container.
# This allows for overriding the executable more easily if needed.
CMD ["bun", "./build"]
