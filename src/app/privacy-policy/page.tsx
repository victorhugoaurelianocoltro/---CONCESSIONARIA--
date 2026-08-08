import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | ParvInfoSoft",
  description: "Read the Privacy Policy of ParvInfoSoft to understand how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white font-general selection:bg-accent-electric selection:text-white">
      <Navbar />
      
      <main className="pt-40 pb-24 container mx-auto px-6 max-w-4xl">
        <div className="prose prose-invert prose-lg max-w-none">
          <h1 className="text-4xl md:text-5xl font-medium mb-12">Privacy Policy</h1>
          <p className="text-white/60 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-white mb-4">1. Introduction</h2>
            <p className="text-white/70 leading-relaxed">
              Welcome to ParvInfoSoft ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. 
              This Privacy Policy applies to our website (parvinfosoft.com) and our B2B AI &amp; IT automation services. 
              If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at parvinfosoftadmin@gmail.com.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-white mb-4">2. Information We Collect</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li>Request an AI Automation audit or ROI consultation.</li>
              <li>Inquire about custom AI voice agents, CRM automation, or software engineering services.</li>
              <li>Contact us via our website forms or live support.</li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              The personal information that we collect depends on the context of your interactions with us, but can include: 
              <strong> Names, business email addresses, phone numbers, company name, and project requirements.</strong>
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-white mb-4">3. How We Use Your Information</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We use personal information collected via our Website for a variety of business purposes described below:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li><strong>To deliver B2B services:</strong> Communicating with you regarding your AI Voice, CRM, App, or Web development project requirements.</li>
              <li><strong>To perform ROI audits:</strong> Analyzing your workflow bottlenecks to provide customized automation blueprints.</li>
              <li><strong>To send administrative information:</strong> Sending project updates, SLA reports, and service policy notifications.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-white mb-4">4. Will Your Information Be Shared?</h2>
            <p className="text-white/70 leading-relaxed">
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. 
              We do not sell, rent, or trade your personal information to third parties for their promotional purposes.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-white mb-4">5. Data Security</h2>
            <p className="text-white/70 leading-relaxed">
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. 
              However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-white mb-4">6. Contact Us</h2>
            <p className="text-white/70 leading-relaxed">
              If you have questions or comments about this notice, you may email us at <strong>parvinfosoftadmin@gmail.com</strong> or contact us by post at:<br/><br/>
              ParvInfoSoft<br/>
              4019 The Palladium Mall, Near Vijaynagar, Chikuwadi<br/>
              Nana Varachha, Surat, Gujarat 395010<br/>
              India
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
