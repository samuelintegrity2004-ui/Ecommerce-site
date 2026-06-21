const HomepageSettings = require('../models/HomepageSettings');
const Product = require('../models/Product');

const defaultSections = [
  { key: 'todaysDeal', label: "Today's Deal", enabled: true, order: 1, limit: 8 },
  { key: 'newArrival', label: 'New Arrival', enabled: true, order: 2, limit: 8 },
  { key: 'latestModel', label: 'Latest Model', enabled: true, order: 3, limit: 8 },
  { key: 'hot', label: 'Hot', enabled: true, order: 4, limit: 8 },
  { key: 'trending', label: 'Trending Now', enabled: true, order: 5, limit: 8 },
];

const getSettingsDocument = async () => {
  let settings = await HomepageSettings.findOne().populate('heroSlides.product');
  if (!settings) {
    settings = await HomepageSettings.create({ sections: defaultSections, heroSlides: [] });
    settings = await settings.populate('heroSlides.product');
  }
  if (!settings.sections?.length) {
    settings.sections = defaultSections;
    await settings.save();
  }
  return settings;
};

const getHomepageSettings = async (req, res) => {
  const settings = await getSettingsDocument();
  res.json(settings);
};

const updateHomepageSettings = async (req, res) => {
  const settings = await getSettingsDocument();
  settings.sections = req.body.sections || settings.sections;
  await settings.save();
  res.json(await settings.populate('heroSlides.product'));
};

const addHeroSlide = async (req, res) => {
  const settings = await getSettingsDocument();
  settings.heroSlides.push({
    product: req.body.product || undefined,
    bannerImage: req.file ? `/uploads/${req.file.filename}` : req.body.bannerImage,
    title: req.body.title,
    subtitle: req.body.subtitle,
    buttonText: req.body.buttonText,
    destinationLink: req.body.destinationLink,
    order: Number(req.body.order ?? settings.heroSlides.length),
    isActive: req.body.isActive !== 'false',
  });
  await settings.save();
  res.status(201).json(await settings.populate('heroSlides.product'));
};

const updateHeroSlide = async (req, res) => {
  const settings = await getSettingsDocument();
  const slide = settings.heroSlides.id(req.params.slideId);
  if (!slide) return res.status(404).json({ message: 'Hero slide not found' });

  ['product', 'title', 'subtitle', 'buttonText', 'destinationLink'].forEach((field) => {
    if (req.body[field] !== undefined) slide[field] = req.body[field] || undefined;
  });
  if (req.body.bannerImage !== undefined) slide.bannerImage = req.body.bannerImage;
  if (req.file) slide.bannerImage = `/uploads/${req.file.filename}`;
  if (req.body.order !== undefined) slide.order = Number(req.body.order);
  if (req.body.isActive !== undefined) slide.isActive = req.body.isActive === true || req.body.isActive === 'true';

  await settings.save();
  res.json(await settings.populate('heroSlides.product'));
};

const deleteHeroSlide = async (req, res) => {
  const settings = await getSettingsDocument();
  settings.heroSlides.pull({ _id: req.params.slideId });
  await settings.save();
  res.json(await settings.populate('heroSlides.product'));
};

const getHomepageContent = async (req, res) => {
  const settings = await getSettingsDocument();
  const enabledSections = [...settings.sections].filter((section) => section.enabled).sort((a, b) => a.order - b.order);

  const sections = await Promise.all(enabledSections.map(async (section) => {
    const query = section.key === 'newArrival' ? {} : { sections: section.key };
    const products = await Product.find(query).sort({ createdAt: -1 }).limit(section.limit);
    return { ...section.toObject(), products };
  }));

  res.json({
    heroSlides: settings.heroSlides
      .filter((slide) => slide.isActive)
      .sort((a, b) => a.order - b.order),
    sections,
  });
};

module.exports = {
  getHomepageSettings,
  updateHomepageSettings,
  addHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  getHomepageContent,
};
