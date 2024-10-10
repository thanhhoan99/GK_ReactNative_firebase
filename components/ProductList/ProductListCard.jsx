import { View, Text ,Image, TouchableOpacity, Alert, ToastAndroid } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import { useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../Config/FirebaseConfigs'


export default function ProductListCard({product}) {

  const router=useRouter();


  const onDelete=()=>{
    Alert.alert('Do you want to Delete?','Do you really want to Delete this Product?',[
     {
      text:'Cancel',
      style:'Cancel'
    },
    {
      text:'Delete',
      style:'destructive',
      onPress:()=>deleteProduct()
    } 
    ])
    
}
  const deleteProduct=async()=>{
    console.log("Delete Product")
    await deleteDoc(doc(db,'ProductList',product?.id));
    // router.back();
    ToastAndroid.show('Product delete',ToastAndroid.LONG)
  }
  return (
    <View style={{ padding: 15 }}>
    <View style={{ backgroundColor: '#fff', borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 3 }}>
      
      {/* Image Section */}
      <TouchableOpacity onPress={() => router.push("/productdetail/" + product?.id)} style={{ borderRadius: 15, overflow: 'hidden' }}>
        <Image
          source={{ uri: product.imageUrl }}
          style={{ width: '100%', height: 150 }}
          resizeMode="cover"
        />
      </TouchableOpacity>
  
      {/* product Information Section */}
    <View style={{ padding: 15 }}>
        
    <View style={{ marginBottom: 10 , flexDirection: 'row', alignItems: 'center' }}> 
        <Text>Tên SP :</Text>
        <Text style={{
          fontSize: 16,
          color: '#333'
        }}> {product.name}
        </Text>
      </View>  
        {/* Category Tag */}
        <View style={{ marginBottom: 10 , flexDirection: 'row', alignItems: 'center' }}>
          <Text>Loại SP :</Text>
          <Text style={{
            backgroundColor: Colors.PRIMARY,
            color: '#fff',
            paddingVertical: 3,
            paddingHorizontal: 8,
            fontSize: 12,
            borderRadius: 15,
            alignSelf: 'flex-start'
          }}>{product.category}
          </Text>
        </View>
  
    <View style={{ marginBottom: 10 , flexDirection: 'row', alignItems: 'center' }}> 
        <Text>Giá SP :</Text>
        <Text style={{
          // fontFamily: 'outfit',
          color: Colors.RED,
          fontSize: 15,
        }}> {product.price} VND
        </Text>
    </View>
        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          
          {/* Edit Button */}
          <TouchableOpacity onPress={() => router.push("product/update/" + product?.id)} style={{
            padding: 10,
            backgroundColor: Colors.LIGHT_GRAY,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            width: 50,
            height: 50
          }}>
            <Ionicons name="create-outline" size={24} color="black" />
          </TouchableOpacity>
  
          {/* Delete Button */}
          <TouchableOpacity onPress={onDelete} style={{
            padding: 10,
            backgroundColor: Colors.LIGHT_GRAY,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            width: 50,
            height: 50
          }}>
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
  
    
  )
}