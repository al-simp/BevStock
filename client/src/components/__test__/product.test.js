

import React from 'react';
import ReactDOM from 'react-dom';
import Product from '../stocktaking/Product'
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import renderer from 'react-test-renderer';

//cleanup function to run after each test
afterEach(cleanup)

//test to make sure component renders without crashing
it("renders without crashing", ()=>{
    const div = document.createElement("div");
    ReactDOM.render(<Product></Product>, div)
})

//test to make sure row renders text correctly
it("renders row correctly", ()=>{
   const {getByTestId} = render(<Product key="1" name="test product" id="1"></Product>)
   expect(getByTestId('product')).toHaveTextContent('test product')
})

//snapshot test
it("matches snapshot", () => {
    const tree = renderer.create(<Product key="1" name="test product" id="1"></Product>).toJSON();
    expect(tree).toMatchSnapshot();
}) 


