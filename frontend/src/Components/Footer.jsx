import { GrSend } from "react-icons/gr";
function Footer(props) {
  return (
    <footer className="main-footer">
      <div className="upper-box">
        <div className="auto-container">
          <div className="row no-gutters flex flex-row">
            <div className="footer-info-box col-md-4 col-sm-6 col-xs-12">
              <div className="info-inner">
                <div className="content">
                  <div className="icon">
                    <span className="flaticon-pin"></span>
                  </div>
                  <div className="text">
                    54B, Tailstoi Town 5238 MT, <br /> La city, IA 522364
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-info-box col-md-4 col-sm-6 col-xs-12">
              <div className="info-inner">
                <div className="content">
                  <div className="icon">
                    <span className="flaticon-email"></span>
                  </div>
                  <div className="text">
                    Email us : <br />{" "}
                    <a href="mailto:contact.contact@autorex.com">
                      contact@autorex.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-info-box col-md-4 col-sm-6 col-xs-12">
              <div className="info-inner">
                <div className="content">
                  <div className="icon">
                    <span className="flaticon-phone"></span>
                  </div>
                  <div className="text">
                    Call us on : <br />
                    <strong>+ 1800 456 7890</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="widgets-section">
        <div className="auto-container">
          <div className="widgets-inner-container">
            <div className="row clearfix ">
              {/* <div className="footer-column ">
                <div className="widget widget_about">
                  <div className="text">
                    Capitalize on low hanging fruit to identify a ballpark value
                    added activity to beta test. Override the digital divide
                    additional clickthroughs.
                  </div>
                </div>
              </div> */}
              <div className="footer-column ">
                <div className="flex flex-row justify-between items-center">
                  <div>
                    <p className="wrap text-white">
                      Capitalize on low hanging fruit to
                      <br />
                      identify a ballpark
                      <br />
                      value added activity to beta test.
                      <br />
                      Override the digital
                      <br />
                      divide additional clickthroughs.
                    </p>
                  </div>
                  <div className="widget widget_links">
                    <h4 className="widget_title">Usefull Links</h4>
                    <div className="widget-content">
                      <ul className="list">
                        <li>
                          <a href="index.html">Home</a>
                        </li>
                        <li>
                          <a href="about.html">About Us</a>
                        </li>
                        <li>
                          <a href="#">Appointment</a>
                        </li>
                        <li>
                          <a href="testimonial.html">Testimonials</a>
                        </li>
                        <li>
                          <a href="contact.html">Contact Us</a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="widget widget_links">
                    <h4 className="widget_title">Our Services</h4>
                    <div className="widget-content">
                      <ul className="list">
                        <li>
                          <a href="#">Performance Upgrade</a>
                        </li>
                        <li>
                          <a href="#">Transmission Service</a>
                        </li>
                        <li>
                          <a href="#">Break Repair & Service</a>
                        </li>
                        <li>
                          <a href="#">Engine Service & Repair</a>
                        </li>
                        <li>
                          <a href="#">Trye & Wheels</a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="footer-column ">
                    <div className="widget widget_newsletter">
                      <h4 className="widget_title">Newsletter</h4>
                      <div className="text">Get latest updates and offers.</div>
                   
                      <div className="flex items-center">
                        <input
                          type="text"
                          className="p-2 border b-2 border-white rounded-l-lg bg-inherit outline-none text-white placeholder-gray-400"
                          placeholder="Type your message"
                        />
                        <button className="bg-red-500 text-white p-2 rounded-r-lg hover:bg-red-600 focus:outline-none">
                          <GrSend size={24} />
                        </button>
                      </div>

                      <div className="newsletter-form"></div>
                      <ul className="social-links">
                        <li>
                          <a href="#">
                            <span className="fab fa-facebook-f"></span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <span className="fab fa-linkedin-in"></span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <span className="fab fa-twitter"></span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <span className="fab fa-google-plus-g"></span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="auto-container">
        <div className="footer-bottom">
          <div className="copyright-text">
            © Copyright <a href="#">Abe Garage</a> 2023 . All right reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
