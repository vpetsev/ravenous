const Yelp = {
  async search(term, location, sortBy) {
    const query = new URLSearchParams({ term, location, sort_by: sortBy });
    const response = await fetch(`/api/yelp?${query}`);
    const data = await response.json();
    if (!response.ok || !Array.isArray(data.businesses)) {
      throw new Error(data.error || 'Unable to search businesses. Please try again.');
    }
    return data.businesses.map(business => ({
      id: business.id,
      imageSrc: business.image_url,
      name: business.name,
      address: business.location.address1,
      city: business.location.city,
      state: business.location.state,
      zipCode: business.location.zip_code,
      category: business.categories[0]?.title || 'Uncategorized',
      rating: business.rating,
      reviewCount: business.review_count
    }));
  }
};
export default Yelp;
