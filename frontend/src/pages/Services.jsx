
import { Link } from "react-router-dom";
import bg1 from "../assets/images/banner/bg-1.jpg";
import image4 from "../assets/images/banner/image-4.jpg";
import image6 from "../assets/images/banner/bg-4.jpg";

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

// Component to display each feature block
const FeatureBlock = ({ title, icon }) => (
  <div className="icon-box">
    <div className="icon">
      <span className={icon}></span>
    </div>
    <h4>{title}</h4>
  </div>
);

const Services = () => {
	return (
    <div>
      <>
        <div
          className="page-title"
          style={{ backgroundImage: `url(${image6})` }}
        >
          <div className="auto-container">
            <h2 style={{ paddingLeft: "10px" }}>Our services</h2>
            <ul className="page-breadcrumb" style={{ paddingLeft: "10px" }}>
              <li style={{ display: "inline", marginRight: "10px" }}>
                {/* Use Link for navigation instead of <a> */}
                <Link to="/" style={{ color: "#f00", fontSize: "30px" }}>
                  Home
                </Link>
              </li>
              <li
                style={{ display: "inline", color: "#fff", fontSize: "20px" }}
              >
                services
              </li>
            </ul>
          </div>
        </div>
      </>

      <section className="services-section style-three">
        <div className="auto-container">
          <div className="sec-title style-two">
            <h2>Our Services</h2>
            <div className="text">
              Bring to the table win-win survival strategies to ensure proactive
              domination. At the end of the day, going forward, a new normal
              that has evolved from generation X is on the runway heading
              towards a streamlined cloud solution.{" "}
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 service-block-one">
              <div className="inner-box hvr-float-shadow">
                <h5>Service and Repairs</h5>
                <h2>Performance Upgrade</h2>
                <a href="service-details.html" className="read-more">
                  read more +
                </a>
                <div className="icon">
                  <span className="flaticon-power"></span>
                </div>
              </div>
            </div>
            <div className="col-lg-4 service-block-one">
              <div className="inner-box hvr-float-shadow">
                <h5>Service and Repairs</h5>
                <h2>Transmission Services</h2>
                <a href="service-details.html" className="read-more">
                  read more +
                </a>
                <div className="icon">
                  <span className="flaticon-gearbox"></span>
                </div>
              </div>
            </div>
            <div className="col-lg-4 service-block-one">
              <div className="inner-box hvr-float-shadow">
                <h5>Service and Repairs</h5>
                <h2>Break Repair & Service</h2>
                <a href="service-details.html" className="read-more">
                  read more +
                </a>
                <div className="icon">
                  <span className="flaticon-brake-disc"></span>
                </div>
              </div>
            </div>
            <div className="col-lg-4 service-block-one">
              <div className="inner-box hvr-float-shadow">
                <h5>Service and Repairs</h5>
                <h2>Engine Service & Repair</h2>
                <a href="service-details.html" className="read-more">
                  read more +
                </a>
                <div className="icon">
                  <span className="flaticon-car-engine"></span>
                </div>
              </div>
            </div>
            <div className="col-lg-4 service-block-one">
              <div className="inner-box hvr-float-shadow">
                <h5>Service and Repairs</h5>
                <h2>Tyre & Wheels</h2>
                <a href="service-details.html" className="read-more">
                  read more +
                </a>
                <div className="icon">
                  <span className="flaticon-tire"></span>
                </div>
              </div>
            </div>
            <div className="col-lg-4 service-block-one">
              <div className="inner-box hvr-float-shadow">
                <h5>Service and Repairs</h5>
                <h2>Denting & Painting</h2>
                <a href="service-details.html" className="read-more">
                  read more +
                </a>
                <div className="icon">
                  <span className="flaticon-spray-gun"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <div className="why-choose-us">
        <div className="row" style={{ width: "90%", margin: "0 auto" }}>
          <div className="col-lg-6">
            <div className="sec-title style-two">
              <h2>Why Choose Us</h2>
              <div className="text">
                Bring to the table win-win survival strategies to ensure
                proactive domination. At the end of the day, going forward, a
                new normal that has evolved from generation heading towards.
              </div>
            </div>
            {features.map((feature, index) => (
              <FeatureBlock
                key={index}
                title={feature.title}
                icon={feature.icon}
              />
            ))}
          </div>
          <div className="col-lg-6">
            <div className="sec-title style-two">
              <h2>Additional Services</h2>
            </div>
            <div className="row">
              <div className="col-md-5">
                <div className="image">
                  <img
                    src={image4}
                    alt="Additional Services"
                    style={{ width: "300px", height: "400px" }}
                  />
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
      </div>
      <div className="video-section" style={{ backgroundImage: `url(${bg1})` }}>
        <h5 style={{ paddingLeft: "80px" }}>Working since 2000</h5>
        <h2 style={{ paddingLeft: "80px" }}>
          We are leader <br /> in Car Mechanical Work
        </h2>
        <div className="video-box" style={{ paddingLeft: "80px" }}>
          <div className="video-btn">
            <a
              href="https://www.youtube.com/watch?v=nfP5N9Yc72A&t=28s"
              className="overlay-link lightbox-image video-fancybox ripple"
              style={{ textDecoration: "none" }}
            >
              <i
                className="flaticon-play"
                style={{ textDecoration: "none" }}
              ></i>
            </a>
          </div>
          <div className="text">
            Watch intro video <br /> about us
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="wrapper-box" style={{ width: "90%", margin: "0 auto" }}>
          <div className="left-column">
            <h3>Schedule Your Appointment Today</h3>
            <div className="text">
              Your Automotive Repair & Maintenance Service Specialist
            </div>
          </div>
          <div className="right-column">
            <div className="phone">1800.456.7890</div>
            <div className="btn">
              <a href="#" className="theme-btn btn-style-one">
                <span>Appointment</span>
                <i className="flaticon-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;