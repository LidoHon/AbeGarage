import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

// Defining an array of services with their titles, icons, descriptions, and routes
const services = [
    { title: "All Orders", subtitle: "OPEN FOR ALL", linkText: "LIST OF ORDERS +", icon: "flaticon-power", link: "/admin/orders" },
    { title: "New Orders", subtitle: "OPEN FOR LEADS", linkText: "ADD ORDER +", icon: "flaticon-gearbox", link: "/admin/add-order" },
    { title: "Add Order", subtitle: "OPEN FOR LEADS", linkText: "ADD ORDER +", icon: "flaticon-gearbox", link: "/admin/add-order" }, // Add Order Service
    { title: "Employees", subtitle: "OPEN FOR ADMINS", linkText: "LIST OF EMPLOYEES +", icon: "flaticon-brake-disc", link: "/admin/employees" },
    { title: "Add Employee", subtitle: "OPEN FOR ADMINS", linkText: "ADD EMPLOYEE +", icon: "flaticon-car-engine", link: "/admin/add-employee" },
    { title: "Add Customer", subtitle: "OPEN FOR ADMINS", linkText: "ADD CUSTOMER +", icon: "flaticon-car-engine", link: "/admin/add-customer" }, // Add Customer Service
    { title: "Engine Service & Repair", subtitle: "SERVICE AND REPAIRS", linkText: "READ MORE +", icon: "flaticon-tire", link: "/admin/services/engine-repair" },
    { title: "Tyre & Wheels", subtitle: "SERVICE AND REPAIRS", linkText: "READ MORE +", icon: "flaticon-spray-gun", link: "/admin/services/tyre-wheels" },
    { title: "Denting & Painting", subtitle: "SERVICE AND REPAIRS", linkText: "READ MORE +", icon: "flaticon-spray-gun", link: "/admin/services/denting-painting" }
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
const ServiceBlock = ({ title, subtitle, linkText, icon, link }) => (
    <div className="col-lg-4 service-block-one">
      <Link to={link}>
        <div className="inner-box hvr-float-shadow">
          <h5>{subtitle}</h5>
          <h2>{title}</h2>
          <div className="read-more">{linkText}</div>
          <div className="icon"><span className={icon}></span></div>
        </div>
      </Link>
    </div>
);
ServiceBlock.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired, 
};

// AdminDashboard component
const AdminDashboard = () => {
    return (
        <Section className="services-section">
            <div className="sec-title style-two">
                <h2>Admin Dashboard</h2>
                <div className="text">
                    Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution.
                </div>
            </div>
            <div className="row" style={{ width: '90%', margin: '0 auto' }}>
                {services.map((service, index) => (
                    <ServiceBlock
                        key={index}
                        title={service.title}
                        subtitle={service.subtitle}
                        linkText={service.linkText}
                        icon={service.icon}
                        link={service.link} 
                    />
                ))}
            </div>
        </Section>
    );
};

export default AdminDashboard;
