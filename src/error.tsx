import { Link } from "react-router-dom";
import Wrapper from "./layouts/Wrapper";
 

const NotFound = () => {
	return (
		<Wrapper>
				<div className="error-page">
						<section className="error-section text-center">
							<div className="container">
								<div className="error-content">
									<h1>404</h1>
									<h2>Oops! That Page Can Not be Found.</h2>
									<Link
										to="/"
										className="primary-btn one gradient-bg white-color border-btn"
									>
										<span>Back Home</span>
										<i className="icon-1 gradient-color"></i>
									</Link>
								</div>
							</div>
						</section>
					</div>
		</Wrapper>
	);
};

export default NotFound;
