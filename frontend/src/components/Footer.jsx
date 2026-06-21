import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="appFooter" aria-label="Footer">
      <motion.div
        className="footerInner"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
      >
        <div className="footerBrand">
          <div className="footerTitle">Campus Lost &amp; Found</div>
          <div className="footerSubtitle">
            A modern place to reunite campus belongings.
          </div>
        </div>

        <div className="footerCols">
          <div>
            <div className="footerColTitle">Contact</div>
            <div className="footerLink">lostfound@example.edu</div>
            <div className="footerLink">+1 (555) 123-4567</div>
          </div>
          <div>
            <div className="footerColTitle">Hours</div>
            <div className="footerText">Mon–Fri · 9:00 AM – 5:00 PM</div>
            <div className="footerText">Weekend: by request</div>
          </div>
          <div>
            <div className="footerColTitle">Location</div>
            <div className="footerText">Student Center · Ground Floor</div>
          </div>
        </div>

        <div className="footerBottom">
          <span>© {new Date().getFullYear()} Campus Lost &amp; Found</span>
          <span className="footerDot">•</span>
          <span>Built with React + Express</span>
        </div>
      </motion.div>
    </footer>
  )
}

