type Product ={
    id: string,
    title: string,
    desc: string,
    qty: number
    date: Date
}

let products: Product[] = [
    { id: "1", title: 'Product 1', desc: 'desc of Product 1', qty: 10, date: new Date() },
    { id: "2", title: 'Product 2', desc: 'desc of Product 2', qty: 30, date: new Date() },
    { id: "3", title: 'Product 3', desc: 'desc of Product 3', qty: 25, date: new Date() },
  ]

export const getProducts = () => products
export const addOrder = (product: Product) => {
    products.push(product)

    return products
}
export const putOrder = (id: string, title: string, desc: string, qty: number) => {
    let productId = products.find(i => i.id === id)
    console.log(productId, 'productId')
    if(productId){
        // productId.title = title
        // productId.desc = desc
        // productId.qty = qty
        products.map((i:Product)=> {
            if(i.id == id) { 
                i.title = title
                i.desc = desc
                i.qty = qty
            }
            return i
        })
    }else{
        throw new Error('Product not found')
    }
   
    return products
}
export const deleteOrder = (id: string) => {
    console.log(id, 'id')
    products = products.filter(i => i.id !== id)
    return products
}
export const getOrderById = (id: string) => {  
    console.log(id, 'id')  
    console.log(products, 'products')
    let product = products.find(i => i.id == id)
    return product
}
