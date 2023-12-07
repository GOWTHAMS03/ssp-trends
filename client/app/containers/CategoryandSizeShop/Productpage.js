import React from 'react';
import { Link } from 'react-router-dom';
import AddToWishList from '../../components/Store/AddToWishList';

const ProductPage = (props) => {
  const { products, storesizes, updateWishlist, authenticated } = props;

  const getSizeName = (sizeId) => {
    const size = storesizes.find((size) => size._id === sizeId);
    return size ? size.name : 'Size not found';
  };

  return (
    <div className='product-list'>
      {products.map((product, index) => (
        <div key={index} className='mb-3 mb-md-0'>
          <div className='product-container'>
            <div className='item-box'>
            <div className='add-wishlist-box '>
            <div>
           
            </div>

            <div>
              {product.inventory <= 0 && !shopFormErrors['quantity'] ? (
                     <p className='stock out-of-stock'>Out of stock</p>
                   ) : (
                     <p className='stock in-stock'>In stock</p>
                   )}
              </div>
              </div>
              <div className='item-link'>
                <Link to={`/product/${product.slug}`} className='d-flex flex-column h-100'>
                  <div className='item-image-container'>
                    <div className='item-image-box'>
                      <img
                        className='item-image'
                        src={product.imageUrl ? product.imageUrl : '/images/placeholder-image.png'}
                        alt='Product Image'
                      />
                    </div>
                  </div>
                  <div className='item-body'>
                    <div className='item-details p-3'>
                      <h1 className='item-name'>{product.name}</h1>
                      {product.size && Object.keys(product.size).length > 0 && (
                        <p className='by'>
                          Size <span>{getSizeName(product.size)}</span>
                        </p>
                      )}
                      <p className='item-desc mb-0'>{product.description}</p>
                    </div>
                  </div>
                  <div className='d-flex flex-row justify-content-between align-items-center px-4 mb-2 item-footer'>
                    <p className='price mb-0'>₹{product.price}</p>
                    {product.totalReviews > 0 && (
                      <p className='mb-0'>
                        <span className='fs-16 fw-normal mr-1'>{parseFloat(product?.averageRating).toFixed(1)}</span>
                        <span
                          className={`fa fa-star ${product.totalReviews !== 0 ? 'checked' : ''}`}
                          style={{ color: '#ffb302' }}
                        ></span>
                      </p>
                    )}
                    <AddToWishList
                  id={product._id}
                  liked={product?.isLiked ?? false}
                  enabled={authenticated}
                  updateWishlist={updateWishlist}
                  authenticated={authenticated}
                />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductPage;