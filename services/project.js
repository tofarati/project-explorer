import { ObjectId } from "mongodb";
import dbConnect from "../lib/middleware/dbConnect";
import Project from "../models/project";
import { translateError } from "../models/mongo_helper";
import generatePipeline from "../lib/utils/searchQuery";

const TTL = (1000 * 60 * 30);
let cached = global.projects;

if(!cached) {
  cached = global.projects = { showcase: null };
}

const cacheClear = setInterval(() => {
  cached.showcase = null;
}, TTL);
cacheClear.unref();

export async function create({ name, abstract, authors, tags, createdBy }) {
  const project = new Project({
    name,
    abstract,
    authors,
    tags,
    createdBy
  });
  try{
    await dbConnect();
    let created = await project.save();
    return [true, created];
  } catch (error) {
    return [false, translateError(error)];
  }
};

export async function getById(id) {
  try {
    await dbConnect();
    const proj = await Project.findById(id).populate('createdBy', {password: 0, salt: 0, matricNumber: 0, email: 0, project_views: 0 }).lean();
    return proj;
  }
  catch(err) {
    console.log(translateError(err)) ;
  }
};

export async function getAll() {
  try {
    await dbConnect();
    const projects = await Project.find({}).lean();
    return projects;
  }
  catch(err) {
    console.log(translateError(err)) ;
  }
};

export async function getShowcase() {
  if (cached.showcase) {
    return cached.showcase;
  }
  try {
    await dbConnect();
    const projectArr = await Project.find({}).limit(4).sort({createdAt: -1}).lean();
    cached.showcase = projectArr;
    return projectArr;
  }
  catch(err) {
    console.log(translateError(err)) ;
  }
};

export async function searchByCriteria(query) {
  const pipeline = generatePipeline(query);
  try {
    await dbConnect();
    const results = await Project.aggregate(pipeline).exec();
    return [true, results];
  }
  catch(error) {
    return [false, translateError(error)];
  }
};

export async function deleteProject(project) {
  await dbConnect();
  return await Project.deleteOne({ _id: ObjectId(project._id) });
}