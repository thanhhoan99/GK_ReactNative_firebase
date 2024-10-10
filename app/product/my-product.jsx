import { View, Text,FlatList , TouchableOpacity, Alert, ToastAndroid} from 'react-native'
import React, { useEffect } from 'react'
import {db, storage} from '../../Config/FirebaseConfigs'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { useState } from 'react';
import { useNavigation } from 'expo-router';
import { Colors } from '@/constants/Colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import ProductListCard from './../../components/ProductList/ProductListCard'

export default function MyProduct() {
   
    const router=useRouter();
    const [productList,setProductList]=useState([]);
    const [loading,setLoading]=useState(false);
    const navigation=useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerShown:true,
            headerTitle:'My Product',
            headerStyle:{
                backgroundColor:Colors.PRIMARY
            }
        });
      GetUserProduct()
    }, []);

    const GetUserProduct=async()=>{
        setLoading(true);
        setProductList([]);
        const q=query(collection(db,'ProductList'));
        const querySnapshpt=await getDocs(q);

        querySnapshpt.forEach((doc)=>{
            console.log(doc.data())
            setProductList(prev=>[...prev,{id:doc?.id, ...doc.data()}])
       
    })
    setLoading(false);
}


  return (
    <View  style={{
        padding:20,backgroundColor:'#E8E8E8'
    }}>
        
         {/* "Go Back" Button */}
         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle" size={40} color="black" />
                </TouchableOpacity>
                <Text style={{color:Colors.PRIMARY}}>View All</Text>
            </View>
        <FlatList
            onRefresh={GetUserProduct}
            refreshing={loading}
            data={productList}
            renderItem={({item,index})=>(
                <ProductListCard product={item} key={index}/>
        )}
        
        />  
    </View>
  )
}