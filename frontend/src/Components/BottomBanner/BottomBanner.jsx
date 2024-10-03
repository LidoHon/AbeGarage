const BottomBanner = () => {
  return (
    <div>
      <Section className="why-choose-us">
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
      </Section>

      {/* Second Video Section */}
      <Section
        className="video-section"
        style={{ backgroundImage: `url(${bg1})` }}
      >
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
      </Section>

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

export default BottomBanner