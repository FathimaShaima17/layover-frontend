import React from 'react';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs';
import { AddPlaceForm } from '../components/forms/AddPlaceForm';
import { PlusCircle } from 'lucide-react';

export const AddPlacePage: React.FC = () => {
  return (
    <div style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
      <div className="container">
        <Breadcrumbs items={[{ label: 'Submit a Discovery' }]} />

        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.5rem' }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
            <PlusCircle size={15} />
            <span>Community Contributions</span>
          </div>
          <h1 className="section-title">Share a Hidden Place</h1>
          <p className="section-subtitle" style={{ margin: '0.5rem auto 0' }}>
            Contribute a secluded canyon, historic ruin, sacred tree, or neighborhood culinary secret to our shared atlas.
          </p>
        </div>

        <AddPlaceForm />
      </div>
    </div>
  );
};
