import test from 'node:test';
import assert from 'node:assert/strict';
import {profiles,storageProducts} from '../src/storage-data.js';
import {rankProducts,scoreProduct} from '../src/scoring.js';

test('ranking is deterministic and descending',()=>{const result=rankProducts(storageProducts,profiles.tier0);assert.equal(result.length,6);for(let i=1;i<result.length;i++)assert.ok(result[i-1].score>=result[i].score)});
test('missing capacity creates a penalty',()=>{const product={...storageProducts[0],capacity:.1};assert.ok(scoreProduct(product,profiles.efficient).penalties.capacity>0)});
test('weak evidence reduces final score',()=>{const strong=storageProducts[0],weak={...strong,confidence:Object.fromEntries(Object.keys(strong.confidence).map(k=>[k,.2]))};assert.ok(scoreProduct(strong,profiles.tier0).score>scoreProduct(weak,profiles.tier0).score)});
test('all scores remain bounded',()=>{for(const profile of Object.values(profiles))for(const item of rankProducts(storageProducts,profile))assert.ok(item.score>=0&&item.score<=100)});
