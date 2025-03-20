import { getProducts, addOrder } from "@/app/lib/data";
import { NextResponse } from "next/server";
import Cors from 'cors';
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

const cors = Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: '*',  // Allow all origins
  });

// Middleware function to run CORS
async function runMiddleware(req, fn) {
    return new Promise((resolve, reject) => {
      fn(req, {  // Replace res with an empty object since setHeader doesn't exist in Next.js 13
        setHeader: () => {},  // Mock setHeader as a no-op function
      }, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  }

export async function GET() {
    try {
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB);
  
      const products = await db.collection("products").find().toArray();
    // const products = await db
    //                 .collection("products")
    //                 .find()
    //                 .project({ _id: 0 }) // Exclude _id field
    //                 .toArray();
  
      return NextResponse.json({
        message: "Products fetched successfully",
        products,
      });
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return NextResponse.json(
        { message: "Failed to fetch products" },
        { status: 500 }
      );
    }
  }

  export const POST = async (req) => {
    try {
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB);
  
      const { title, desc, qty } = await req.json();
  
      const newOrder = {
        id: Math.random().toString(10).substr(2, 5),
        title,
        desc,
        qty,
        date: new Date(),
      };
  
      const result = await db.collection("products").insertOne(newOrder);
      const products = await db.collection("products").find().toArray();
    // const products = await db
    //             .collection("products")
    //             .find()
    //             .project({ _id: 0 }) // Exclude _id field
    //             .toArray();
      return NextResponse.json({
        message: "Product added successfully",
        products,
      }, {status: 201});
    } catch (error) {
      console.error("Failed to add product:", error);
      return NextResponse.json(
        { message: "Failed to add product" },
        { status: 500 }
      );
    }
  }
// export const GET = async (req, res) => {
//     console.log('GET /products');
//     await runMiddleware(req, cors);
//     let products = await getProducts();
//    return NextResponse.json({message: "List of Products", products}, {status: 200});
// }

// export const POST  = async (req, res) => {
//     try{
//         let { title, desc, qty } = await req.json()
//         console.log('POST /products', title, desc, qty);
//         let newOrder = {
//             id: Math.random().toString(10).substr(2, 5),
//             title: title,
//             desc: desc,
//             qty: qty,
//             date: new Date()
//         }
//         let products = await addOrder(newOrder);
//         return NextResponse.json({products}, {status: 201});
//     }catch(e){
//         return NextResponse.json({message: "Product not added Successfully"}, {status: 404});
//     }
// }