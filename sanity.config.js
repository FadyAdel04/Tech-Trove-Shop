//this file communicates only with the sanity studio admin you will need another one for connecting to sanity through the api with groq
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import schemas from './sanity/schemas';

const config = defineConfig({
    projectId: "n29dbb1f",
    dataset: "production",
    title: "TechTrove-shop",
    apiVersion: "2024-03-13",
    basePath: "/admin",
    plugins: [deskTool()],
    schema: {types: schemas},
})

export default config