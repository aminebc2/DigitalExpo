import React from "react";

const FooterComponent = () => {
    return (
        <footer className="footer">
            <span className="footer-text">
                DigiExpo Platform | All Rights Reserved &copy; {new Date().getFullYear()}
            </span>
        </footer>
    );
};

export default FooterComponent;
