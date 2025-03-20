import { NextResponse } from "next/server";
import { getOrderById, putOrder, deleteOrder } from "@/app/lib/data";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export const GET = async (req, res) => {
    try {
        let id = req.url.split('products/')[1];
        console.log('GET /products', id);
        let product = await getOrderById(id);

        if(product) {
            return NextResponse.json({message: "Product found", product}, {status: 200});
        }
        else {
            return NextResponse.json({message: "Product not found"}, {status: 404});
        }
    }
    catch (e) {
        return NextResponse.json({message: "Product not found!"}, {status: 404});
    }

}


// PUT: Update an order
export async function PUT(req) {
    try {
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB);
      let id = req.url.split('products/')[1];

      const body = await req.json();
      const { _id, ...updatedOrder } = body;
  
      await db
        .collection("products")
        .updateOne({ _id: new ObjectId(_id) }, { $set: updatedOrder });
  
      const products = await db.collection("products").find().toArray();
  
      return NextResponse.json({
        message: "Order updated successfully",
        products,
      });
    } catch (error) {
      console.error("Failed to update order:", error);
      return NextResponse.json(
        { message: "Failed to update order" },
        { status: 500 }
      );
    }
  }
  
  // DELETE: Delete an order
  export async function DELETE(req) {
    try {
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB);
  
      const body = await req.json();
      let id = req.url.split('products/')[1];
      let _id = body._id;
  
      await db.collection("products").deleteOne({ _id: new ObjectId(_id) });
  
      const products = await db.collection("products").find().toArray();
  
      return NextResponse.json({
        message: "Order deleted successfully",
        products,
      });
    } catch (error) {
      console.error("Failed to delete order:", error);
      return NextResponse.json(
        { message: "Failed to delete order" },
        { status: 500 }
      );
    }
  }

// export const PUT = async (req, res) => {
//     try{
//         let id = req.url.split('products/')[1];
//         let { title, desc, qty } = await req.json();
//         let products = await putOrder(id, title, desc, qty);
//         return NextResponse.json({message: "Product updated", products}, {status: 200});
//     }catch(e){
//         return NextResponse.json({message: "Product not found"}, {status: 404});
//     }
// }

// export const DELETE = async (req, res) => {
//     try{
//         let id = req.url.split('products/')[1];
//         let products = await deleteOrder(id);
//         return NextResponse.json({message: "Product deleted", products}, {status: 200});
//     }catch(e){
//         return NextResponse.json({message: "Product not found"}, {status: 404});
//     }
// }

