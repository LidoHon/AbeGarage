// Importing React library
import React from "react";
import bg1 from "../../assets/images/banner/bg-1.jpg";

const Section = ({ className, style, children }) => (
  <section
    className={className}
    style={{ ...style, maxWidth: "100%", overflowX: "hidden" }}
  >
    <div
      className="auto-container"
      style={{ maxWidth: "100%", paddingLeft: "10px", paddingRight: "10px" }}
    >
      {children}
    </div>
  </section>
);

function Contact() {
  return (
    <div className="page-wrapper">
      <Section
        className="video-section"
        style={{
          background: `linear-gradient(to right, rgba(0, 0, 0, 1), rgba(255, 255, 255, 0.4)), url(${bg1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 style={{ paddingLeft: "80px", color: "white" }}>Contact Us</h2>
        <span style={{ color: "red", paddingLeft: "90px" }}>Home</span>
        <i
          className="flaticon-right-arrow"
          style={{ margin: "0 5px", color: "white", fontSize: "10px" }}
        ></i>
        <span style={{ color: "white" }}>About Us</span>
      </Section>

      {/* Contact Section */}
      <section
        className="contact-section"
        style={{ width: "100%", margin: "0 auto" }}
      >
        <div className="auto-container">
          <div className="row clearfix">
            {/* Map Section */}
            <div className="map-section">
              <div className="map-column">
                <div className="map-outer">
                  <div
                    className="map-canvas"
                    data-zoom="12"
                    data-lat="6.8647"
                    data-lng="37.7807"
                    data-type="roadmap"
                    data-hue="#ffc400"
                    data-title="Wolaita Sodo University"
                    data-icon-path="assets/images/icons/map-marker.png"
                    data-content="Wolaita Sodo University, Ethiopia<br><a href='mailto:info@wou.edu.et'>info@wou.edu.et</a>"
                  >
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49433.60941486469!2d37.721339458734604!3d6.855679514452868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x17b1b088e207e007%3A0x9738824939025f61!2sSoddo!5e1!3m2!1sen!2set!4v1725431820499!5m2!1sen!2set"
                      width="600"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Column */}
            <div className="info-column col-lg-5">
              <div className="inner-column">
                <h4>Our Address</h4>
                <div className="text">
                  Completely synergize resource taxing relationships via premier
                  niche markets. Professionally cultivate one-to-one customer
                  service.
                </div>
                <ul style={{ width: "400px" }}>
                  <li>
                    <i className="flaticon-pin"></i>
                    <span>Address:</span> 54B, wolayta sodo, 5238 MT,
                    IA 5224
                  </li>
                  <li>
                    <i className="flaticon-email"></i>
                    <span>Email:</span> contact@buildtruck.com
                  </li>
                  <li>
                    <i className="flaticon-phone"></i>
                    <span>Phone:</span> 1800 456 7890 / 1254 897 3654
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <Section className="cta-section">
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
      </Section>
    </div>
  );
}

export default Contact;
