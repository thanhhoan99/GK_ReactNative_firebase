import { View, Text ,FlatList, ScrollView} from 'react-native'
import React from 'react'
import ProductListCard from './../../components/Explore/ProductListCard'
export default function ExploreProductList({productList}) {
  return (
  
       <FlatList
            data={productList}
            scrollEnabled
         
            renderItem={({item,index})=>(
                <ProductListCard product={item} key={index}/>
        )}
    />
       
  
  )
}