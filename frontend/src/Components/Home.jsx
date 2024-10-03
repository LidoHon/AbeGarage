import PropTypes from 'prop-types';
import banner1 from "../assets/images/banner/banner.jpg";
import bg1 from "../assets/images/banner/bg-1.jpg";
import vban1 from "../assets/images/banner/vban1.jpg";
import vban2 from "../assets/images/banner/vban2.jpg";
import image3 from "../assets/images/banner/image-3.jpg";
import image4 from "../assets/images/banner/image-4.jpg";

// Defining an array of services with their titles and icons
const services = [
  { title: "Performance Upgrade", icon: "flaticon-power" },
  { title: "Transmission Services", icon: "flaticon-gearbox" },
  { title: "Break Repair & Service", icon: "flaticon-brake-disc" },
  { title: "Engine Service & Repair", icon: "flaticon-car-engine" },
  { title: "Tyre & Wheels", icon: "flaticon-tire" },
  { title: "Denting & Painting", icon: "flaticon-spray-gun" },
];

// Defining an array of features with their titles and icons
const features = [
  { title: "Certified Expert Mechanics", icon: "flaticon-mechanic" },
  { title: "Fast And Quality Service", icon: "flaticon-wrench" },
  { title: "Best Prices in Town", icon: "flaticon-price-tag-1" },
  { title: "Awarded Workshop", icon: "flaticon-trophy" },
];

// Defining an array of additional services offered
const additionalServices = [
  "General Auto Repair & Maintenance",
  "Transmission Repair & Replacement",
  "Tire Repair and Replacement",
  "State Emissions Inspection",
  "Break Job / Break Services",
  "Electrical Diagnostics",
  "Fuel System Repairs",
  "Starting and Charging Repair",
  "Steering and Suspension Work",
  "Emission Repair Facility",
  "Wheel Alignment",
  "Computer Diagnostic Testing",
];

// Reusable Section component for different sections of the page
const Section = ({ className, style, children }) => (
  <section className={className} style={{ ...style, maxWidth: "100%", overflowX: "hidden" }}>
    <div className="auto-container" style={{ maxWidth: "100%", paddingLeft: "10px", paddingRight: "10px" }}>
      {children}
    </div>
  </section>
);
Section.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
};

// Component to display each service block
const ServiceBlock = ({ title, icon }) => (
  <div className="col-lg-4 service-block-one">
    <div className="inner-box hvr-float-shadow">
      <h5>Service and Repairs</h5>
      <h2>{title}</h2>
      <a href="#" className="read-more">read more +</a>
      <div className="icon"><span className={icon}></span></div>
    </div>
  </div>
);
ServiceBlock.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};
// Component to display each feature block
const FeatureBlock = ({ title, icon }) => (
  <div className="icon-box">
    <div className="icon"><span className={icon}></span></div>
    <h4>{title}</h4>
  </div>
);

FeatureBlock.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};
// Main Home component that renders the entire page
const Home = () => {
  return (
    <>
      {/* Video Section */}
      <Section className="video-section" style={{ backgroundImage: `url(${banner1})` }}>
        <h5 style={{ paddingLeft: '80px' }}>Working since 2000</h5>
        <h2 style={{ paddingLeft: '80px' }}>Tuneup Your Car <br /> to Next Level</h2>
        <div className="video-box">
          <div className="video-btn" style={{ paddingLeft: '80px' }}>
            <a
              href="https://www.youtube.com/watch?v=nfP5N9Yc72A&t=28s"
              className="overlay-link lightbox-image video-fancybox ripple"
              style={{ textDecoration: "none" }}
            >
              <i className="flaticon-play" style={{ textDecoration: "none" }}></i>
            </a>
          </div>
          <div className="text">Watch intro video <br /> about us</div>
        </div>
      </Section>

      {/* About Section */}
      <Section className="about-section">
        <div className="row" style={{ width: '90%', margin: '0 auto' }}>
          <div className="col-lg-5">
            <div className="image-box">
              <img src={vban1} alt="Vehicle Banner 1" />
              <img src={vban2} alt="Vehicle Banner 2" />
              <div className="year-experience" data-parallax='{"y": 30}'
              style={{
                left: "70%",
                textAlign: "center",
                padding: "10px",
              }}>
                <strong>24</strong> years <br /> Experience
              </div>
            </div>
          </div>
          <div className="col-lg-7 pl-lg-5" >
            <div className="sec-title" >
              <h5>Welcome to Our workshop</h5>
              <h2>We have 24 years experience</h2>
              <div className="text">
                <p>
                  Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touch points for offshoring.
                </p>
                <p>
                  Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional click through from DevOps. Nanotechnology immersion along the information highway will close the loop on focusing.
                </p>
              </div>
              <div className="link-btn mt-40">
                <a href="/about" className="theme-btn btn-style-one style-two">
                  <span>About Us <i className="flaticon-right"></i>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Services Section */}
      <Section className="services-section">
        <div className="sec-title style-two">
          <h2>Our Services</h2>
          <div className="text">
            Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution.
          </div>
        </div>
        <div className="row" style={{ width: '90%', margin: '0 auto' }}>
          {services.map((service, index) => (
            <ServiceBlock key={index} title={service.title} icon={service.icon} />
          ))}
        </div>
      </Section>

      {/* Features Section */}
      <Section className="features-section">
        <div className="row">
          <div className="col-lg-6">
            <div className="inner-container">
              <h2>Quality Service And <br /> Customer Satisfaction !!</h2>
              <div className="text">
                We utilize the most recent symptomatic gear to ensure your vehicle is fixed or adjusted appropriately and in an opportune manner. We are an individual from Professional Auto Service, a first class execution arrange, where free assistance offices share shared objectives of being world-class car administration focuses.
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="image" >
              <img src={image3} alt="Quality Service" style={{ height: '513px' }}/>
            </div>
          </div>
        </div>
      </Section>

      {/* Why Choose Us & Additional Services Section */}
      <Section className="why-choose-us">
        <div className="row" style={{ width: '90%', margin: '0 auto' }}>
          <div className="col-lg-6">
            <div className="sec-title style-two">
              <h2>Why Choose Us</h2>
              <div className="text">
                Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation heading towards.
              </div>
            </div>
            {features.map((feature, index) => (
              <FeatureBlock key={index} title={feature.title} icon={feature.icon} />
            ))}
          </div>
          <div className="col-lg-6">
            <div className="sec-title style-two">
              <h2>Additional Services</h2>
            </div>
            <div className="row">
              <div className="col-md-5">
                <div className="image">
                  <img src={image4} alt="Additional Services" style={{ width: '300px', height: '400px'}}/>
                </div>
              </div>
              <div className="col-md-7">
                <ul className="list">
                  {additionalServices.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Second Video Section */}
      <Section className="video-section" style={{ backgroundImage: `url(${bg1})`}}>
        <h5 style={{ paddingLeft: '80px' }}>Working since 2000</h5>
        <h2 style={{ paddingLeft: '80px' }}>We are leader <br /> in Car Mechanical Work</h2>
        <div className="video-box" style={{ paddingLeft: '80px' }}>
          <div className="video-btn">
            <a
            href="https://www.youtube.com/watch?v=nfP5N9Yc72A&t=28s"
            className="overlay-link lightbox-image video-fancybox ripple"
            style={{ textDecoration: "none" }}
            >
              <i className="flaticon-play" style={{ textDecoration: "none" }}></i>
            </a>
          </div>
          <div className="text">Watch intro video <br /> about us</div>
        </div>

      </Section>

      {/* Call to Action Section */}
      <Section className="cta-section">
        <div className="wrapper-box" style={{ width: '90%', margin: '0 auto' }}>
          <div className="left-column">
            <h3>Schedule Your Appointment Today</h3>
            <div className="text">Your Automotive Repair & Maintenance Service Specialist</div>
          </div>
          <div className="right-column">
            <div className="phone">1800.456.7890</div>
            <div className="btn">
              <a href="#" className="theme-btn btn-style-one">
                <span>Appointment</span><i className="flaticon-right"></i>
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

// Exporting the Home component as the default export
export default Home;
