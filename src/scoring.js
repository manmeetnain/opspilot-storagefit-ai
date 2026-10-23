import {dimensions} from './storage-data.js';

export function scoreProduct(product, profile){
  let weighted=0, confidence=0, totalWeight=0;
  for(const dimension of dimensions){
    const weight=profile.weights[dimension]||0;
    weighted += product.metrics[dimension]*weight;
    confidence += product.confidence[dimension]*weight;
    totalWeight += weight;
  }
  const base=weighted/totalWeight;
  const evidenceConfidence=confidence/totalWeight;
  const capacityRequired=profile.capacity*1.35;
  const capacityPenalty=product.capacity<capacityRequired?Math.min(18,(1-product.capacity/capacityRequired)*30):0;
  const latencyPenalty=product.latency>profile.latency?Math.min(12,(product.latency/profile.latency-1)*8):0;
  const uncertaintyPenalty=(1-evidenceConfidence)*12;
  const score=Math.max(0,Math.min(100,base-capacityPenalty-latencyPenalty-uncertaintyPenalty));
  const topDimensions=dimensions.slice().sort((a,b)=>(product.metrics[b]*profile.weights[b])-(product.metrics[a]*profile.weights[a])).slice(0,2);
  return {...product,score:Math.round(score),evidenceConfidence:Math.round(evidenceConfidence*100),penalties:{capacity:Math.round(capacityPenalty),latency:Math.round(latencyPenalty),uncertainty:Math.round(uncertaintyPenalty)},topDimensions};
}

export function rankProducts(products,profile){
  return products.map(p=>scoreProduct(p,profile)).sort((a,b)=>b.score-a.score).map((p,index)=>({...p,rank:index+1}));
}
