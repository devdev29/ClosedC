import React from 'react';
import Meta from '../../components/Meta';
import { Partners } from '../../components/component';
import Hero_7 from '../../components/hero/hero_7';
import Services from '../../components/services/services';
import Promo from '../../components/promo/promo';
import Testimonial from '../../components/testimonial/testimonial';
import Faq from '../../components/faq/faq';
import Cta from '../../components/cta/cta';
import Financialnews from '../../components/blog/financialnews';

const Home_7 = () => {
	return (
		<>
			<Meta title="Home 7 || ClosedC | NFT Marketplace " />
			<Hero_7 />
			<Partners />
			<Services />
			<Promo />
			<Testimonial />
			<Faq />
			<Financialnews />
			<Cta />
		</>
	);
};

export default Home_7;
