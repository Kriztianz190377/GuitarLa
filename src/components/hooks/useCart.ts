import { useEffect, useMemo, useState } from "react";
import { db } from "../../assets/db"
import type { CardItem, Guitar } from "../../types";


export const useCart = () => {

    const initialCard = (): CardItem[] => {
        const localStorageCard = localStorage.getItem('cart');
        return localStorageCard ? JSON.parse(localStorageCard) : []
    };

    const [data] = useState(db)
    const [cart, setCart] = useState(initialCard)

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const MAX_ITEM = 5
    const MIN_ITEM = 1


    function addToCart(item:Guitar) {

        const isItemExiste = cart.findIndex(guitar => (guitar.id === item.id));

        if (isItemExiste >= 0) { //existe en el carrito
            if (cart[isItemExiste].quantity >= MAX_ITEM) return
            const updateCart = [...cart];
            updateCart[isItemExiste].quantity++;
            setCart(updateCart);
        } else {
            const newItem:CardItem={...item,quantity : 1}             
            setCart([...cart,newItem])
        }
    }

    const remuvefromCart = (id:Guitar['id']) => {
        // const newArrayCart = cart.filter(guitar => guitar.id !== id)
        // setCart(newArrayCart)
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    const increaseQuantity = (id:Guitar['id']) => {
        const updateCart = cart.map(item => {
            if (item.id === id && item.quantity < MAX_ITEM) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        setCart(updateCart)
    }
    const decreaseQuantity = (id:Guitar['id']) => {
        const updateCart = cart.map(item => {
            if (item.id === id && item.quantity > MIN_ITEM) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        setCart(updateCart)
    }
    const deleteCart = () => {
        console.log('Borrando carritos')
        setCart([])

    }
    // state derived
    const isEmptyCart = useMemo(() => cart.length === 0, [cart])

    const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])
   


    return {
        data,
        cart,
        addToCart,
        remuvefromCart,
        increaseQuantity,
        decreaseQuantity,
        deleteCart,
        isEmptyCart,
        cartTotal

    }
}
