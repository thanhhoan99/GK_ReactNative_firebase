import { View, Text ,Image, TouchableOpacity} from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import { useRouter } from 'expo-router';

export default function ProductListCard({product}) {
    const router=useRouter();
  return (
    <TouchableOpacity 
    onPress={()=>router.push('/productdetail/'+product?.id)}
        style={{
        backgroundColor:'#fff',borderBottomRightRadius:15,borderBottomLeftRadius:15,marginTop:15
    }}>
      <Image source={{uri:product?.imageUrl}}
                        style={{
                            width:'100%',
                            height:150,borderTopRightRadius:15,borderTopLeftRadius:15
                        }}
                    />
        <View style={{
                        padding:10
                 }}>             
                <Text style={{
                        fontFamily:'outfit-bold',
                        fontSize:20
                 }}>{product.name}</Text>
                 <Text style={{
                        fontFamily:'outfit',
                        color:Colors.GRAY
                 }}>{product.price}</Text>
              
          </View>
    </TouchableOpacity>
  )
}