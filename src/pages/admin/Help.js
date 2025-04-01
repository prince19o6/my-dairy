import React, { useState } from 'react';
import {
  Card,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import HelpIcon from '@mui/icons-material/Help';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import ArticleIcon from '@mui/icons-material/Article';

function Help() {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample FAQ data
  const faqs = [
    {
      question: 'How do I add a new product?',
      answer: 'To add a new product, go to the Products page and click on the "Add Product" button. Fill in the required details such as name, price, and stock quantity, then click Save.'
    },
    {
      question: 'How do I process orders?',
      answer: 'Orders can be processed from the Orders page. Click on an order to view its details, then use the action buttons to update its status, generate invoice, or mark it as complete.'
    },
    {
      question: 'How do I generate reports?',
      answer: 'Navigate to the Reports page where you can find various report types including sales, inventory, and customer analytics. Select the desired report type and date range, then click Generate.'
    },
    {
      question: 'How do I manage user accounts?',
      answer: 'User accounts can be managed from the Users page. You can add new users, edit existing ones, or change their roles and permissions from this section.'
    }
  ];

  // Sample documentation sections
  const documentation = [
    {
      title: 'Getting Started',
      icon: <ArticleIcon />,
      description: 'Learn the basics of using the admin panel'
    },
    {
      title: 'User Management',
      icon: <ArticleIcon />,
      description: 'Detailed guide on managing users and permissions'
    },
    {
      title: 'Order Processing',
      icon: <ArticleIcon />,
      description: 'Complete guide to processing and managing orders'
    },
    {
      title: 'Reports & Analytics',
      icon: <ArticleIcon />,
      description: 'Understanding different reports and analytics'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Help Center</h1>
      </div>

      {/* Search Section */}
      <Card className="mb-8 p-6">
        <div className="text-center mb-6">
          <HelpIcon className="text-6xl text-primary-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">How can we help you?</h2>
          <p className="text-gray-500">Search our help center or browse the categories below</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for help..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon className="text-gray-400 mr-2" />
            }}
          />
        </div>
      </Card>



      {/* FAQs Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className="font-medium">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography className="text-gray-600">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>


    </div>
  );
}

export default Help; 