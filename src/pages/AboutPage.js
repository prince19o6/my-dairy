import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';

function AboutPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Team members data
  const teamMembers = [
    {
      name: 'John Smith',
      position: 'CEO & Founder',
      bio: 'With over 20 years of experience in the dairy industry, John founded MilkMaster B2B to provide premium quality dairy products to businesses.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Sarah Johnson',
      position: 'Head of Operations',
      bio: 'Sarah oversees all operational aspects of our dairy production, ensuring the highest standards of quality and efficiency.',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      name: 'Michael Chen',
      position: 'Sales Director',
      bio: 'Michael leads our B2B sales team, building strong relationships with clients and understanding their specific dairy product needs.',
      image: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    {
      name: 'Emily Rodriguez',
      position: 'Quality Control Manager',
      bio: 'Emily ensures that all our products meet the strictest quality standards before they reach our B2B customers.',
      image: 'https://randomuser.me/api/portraits/women/28.jpg'
    }
  ];

  // Company values
  const values = [
    {
      title: 'Quality',
      description: 'We are committed to providing the highest quality dairy products by controlling every step of the process from farm to delivery.'
    },
    {
      title: 'Sustainability',
      description: 'Our sustainable farming practices ensure that we minimize environmental impact while maintaining the health and happiness of our cattle.'
    },
    {
      title: 'Reliability',
      description: 'We understand that businesses depend on consistent supply. Our reliable delivery and consistent product quality are cornerstones of our service.'
    },
    {
      title: 'Innovation',
      description: 'We continuously innovate our processes and products to meet the evolving needs of our B2B customers in the food service industry.'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  position: 'relative',
                  zIndex: 2
                }}
              >
                About My Dairy
              </Typography>
              <Typography
                variant="h5"
                component="p"
                sx={{
                  mb: 3,
                  opacity: 0.9,
                  maxWidth: 700,
                  position: 'relative',
                  zIndex: 2
                }}
              >
                Premium dairy products supplier for businesses since 2005
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  maxWidth: 600,
                  position: 'relative',
                  zIndex: 2
                }}
              >
                My Dairy has been supplying high-quality dairy products to cafes, 
                restaurants, bakeries, and food manufacturers for nearly two decades. 
                Our commitment to quality, sustainability, and service has made us a 
                trusted partner for businesses across the country.
              </Typography>
            </Grid>
          </Grid>
        </Container>
        <Box
          sx={{
            position: 'absolute',
            top: { xs: -100, md: -150 },
            right: { xs: -100, md: -150 },
            width: { xs: 300, md: 450 },
            height: { xs: 300, md: 450 },
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: 1
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: -100, md: -150 },
            left: { xs: -100, md: -150 },
            width: { xs: 250, md: 400 },
            height: { xs: 250, md: 400 },
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: 1
          }}
        />
      </Box>

      {/* Our Story Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1594760467013-64ac2b80b6d3?q=80&w=1000&auto=format&fit=crop"
              alt="Dairy farm"
              sx={{
                width: '100%',
                borderRadius: 2,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Our Story
            </Typography>
            <Typography variant="body1" paragraph>
              MilkMaster B2B began as a small family-owned dairy farm in 2005. With a commitment 
              to producing the highest quality milk, we quickly gained a reputation among local 
              businesses for our fresh and delicious dairy products.
            </Typography>
            <Typography variant="body1" paragraph>
              As demand grew, we expanded our operations while maintaining our core values of 
              quality, sustainability, and service. Today, we operate multiple dairy farms and 
              a state-of-the-art processing facility, supplying premium dairy products to 
              businesses nationwide.
            </Typography>
            <Typography variant="body1">
              Our direct farm-to-business model allows us to maintain strict quality control at 
              every step, ensuring that our B2B customers receive the freshest and highest quality 
              dairy products for their businesses.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* Our Values Section */}
      <Box sx={{ bgcolor: '#f8f9fa', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Our Values
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              The principles that guide everything we do
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 2,
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 'auto' }}>
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Our Process Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            From Farm to Business
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            How we ensure quality at every step
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 0 } }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontSize: 24,
                  fontWeight: 700,
                  mb: 2,
                  mx: 'auto'
                }}
              >
                1
              </Box>
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                Ethical Farming
              </Typography>
              <Typography variant="body2">
                Our cows are raised in spacious, clean environments with access to fresh grass and high-quality feed.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 0 } }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontSize: 24,
                  fontWeight: 700,
                  mb: 2,
                  mx: 'auto'
                }}
              >
                2
              </Box>
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                Careful Processing
              </Typography>
              <Typography variant="body2">
                Our state-of-the-art facility processes milk within hours of collection to maintain freshness and nutritional value.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 0 } }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontSize: 24,
                  fontWeight: 700,
                  mb: 2,
                  mx: 'auto'
                }}
              >
                3
              </Box>
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                Rigorous Testing
              </Typography>
              <Typography variant="body2">
                Every batch of our dairy products undergoes extensive quality testing before it's approved for distribution.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontSize: 24,
                  fontWeight: 700,
                  mb: 2,
                  mx: 'auto'
                }}
              >
                4
              </Box>
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                Fast Delivery
              </Typography>
              <Typography variant="body2">
                Our temperature-controlled delivery vehicles ensure that products reach your business in perfect condition.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Team Section */}
      <Box sx={{ bgcolor: '#f8f9fa', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Meet Our Team
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              The people behind MilkMaster B2B
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    textAlign: 'center',
                    borderRadius: 2,
                    overflow: 'visible'
                  }}
                >
                  <Box sx={{ mt: -4, display: 'flex', justifyContent: 'center' }}>
                    <Avatar
                      src={member.image}
                      alt={member.name}
                      sx={{
                        width: 100,
                        height: 100,
                        border: '4px solid white',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                      }}
                    />
                  </Box>
                  <CardContent sx={{ pt: 4 }}>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" color="primary.main" gutterBottom>
                      {member.position}
                    </Typography>
                    <Divider sx={{ my: 2, width: '30%', mx: 'auto' }} />
                    <Typography variant="body2" color="text.secondary">
                      {member.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Company Stats */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" component="div" color="primary.main" sx={{ fontWeight: 700 }}>
                18+
              </Typography>
              <Typography variant="h6" component="div">
                Years Experience
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" component="div" color="primary.main" sx={{ fontWeight: 700 }}>
                500+
              </Typography>
              <Typography variant="h6" component="div">
                B2B Clients
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" component="div" color="primary.main" sx={{ fontWeight: 700 }}>
                5
              </Typography>
              <Typography variant="h6" component="div">
                Dairy Farms
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" component="div" color="primary.main" sx={{ fontWeight: 700 }}>
                100%
              </Typography>
              <Typography variant="h6" component="div">
                Quality Commitment
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default AboutPage; 