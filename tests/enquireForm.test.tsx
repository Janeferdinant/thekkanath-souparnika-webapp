import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EnquirePage } from '../src/features/public/EnquirePage';
import { StorageService } from '../src/lib/storage';
import type { Enquiry } from '../src/types/models';

vi.mock('../src/lib/emailService', () => ({
  sendEnquiryAcknowledgmentEmail: vi.fn().mockResolvedValue(undefined),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/enquire']}>
      <EnquirePage />
    </MemoryRouter>,
  );

const FAKE_ENQUIRY = {
  id: 'e1',
  reference: 'TS-ENQ-TEST',
  customerName: 'Asha Menon',
  customerPhone: '9847012345',
  customerEmail: 'not-provided@customer.com',
  preferredDate: '2030-01-15',
} as unknown as Enquiry;

const fillStep1 = () => {
  fireEvent.change(screen.getByLabelText(/Preferred Event Date/i), { target: { value: '2030-01-15' } });
  fireEvent.click(screen.getByRole('button', { name: /Continue to Contact Details/i }));
};

const fillStep2 = () => {
  fireEvent.change(screen.getByLabelText(/Your Full Name/i), { target: { value: 'Asha Menon' } });
  fireEvent.change(screen.getByLabelText(/Mobile Phone/i), { target: { value: '9847012345' } });
  fireEvent.click(screen.getByRole('button', { name: /Review Enquiry/i }));
};

const reachReview = () => {
  renderPage();
  fillStep1();
  fillStep2();
  fireEvent.click(screen.getByLabelText(/I give permission/i));
};

describe('enquiry form accessibility', () => {
  it('step 1 inputs are reachable by their labels', () => {
    renderPage();
    expect(screen.getByLabelText(/Type of Event/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Preferred Event Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Expected Guests/i)).toBeInTheDocument();
  });

  it('the session choice is a labelled group of toggle buttons', () => {
    renderPage();
    const group = screen.getByRole('group', { name: /Select Event Session/i });
    const buttons = group.querySelectorAll('button');
    expect(buttons).toHaveLength(3);
    expect([...buttons].filter((b) => b.getAttribute('aria-pressed') === 'true')).toHaveLength(1);
  });

  it('flags an invalid guest count with aria-invalid and a linked, announced message', () => {
    renderPage();
    fireEvent.change(screen.getByLabelText(/Preferred Event Date/i), { target: { value: '2030-01-15' } });
    const guests = screen.getByLabelText(/Expected Guests/i);
    fireEvent.change(guests, { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue to Contact Details/i }));
    expect(guests.getAttribute('aria-invalid')).toBe('true');
    const message = document.getElementById(guests.getAttribute('aria-describedby')!)!;
    expect(message.textContent).toMatch(/expected number of guests/i);
    expect(message.getAttribute('role')).toBe('alert');
  });

  it('step 2 fields are labelled and flag errors', () => {
    renderPage();
    fillStep1();
    fireEvent.click(screen.getByRole('button', { name: /Review Enquiry/i }));
    const name = screen.getByLabelText(/Your Full Name/i);
    expect(name.getAttribute('aria-invalid')).toBe('true');
    expect(document.getElementById(name.getAttribute('aria-describedby')!)!.textContent).toMatch(/full name/i);
    expect(screen.getByLabelText(/Mobile Phone/i).getAttribute('aria-invalid')).toBe('true');
  });
});

describe('enquiry submission states', () => {
  it('shows an error, never a success or "booked" message, and allows a retry when saving fails', async () => {
    const create = vi.spyOn(StorageService, 'createEnquiry').mockImplementation(() => {
      throw new Error('network down');
    });
    reachReview();

    const submit = screen.getByRole('button', { name: /Submit Booking Enquiry/i });
    fireEvent.click(submit);

    // while sending: disabled and says so
    const sending = await screen.findByRole('button', { name: /Sending/i });
    expect(sending).toBeDisabled();

    const alert = await screen.findByRole('alert', {}, { timeout: 3000 });
    expect(alert.textContent).toMatch(/error occurred while saving/i);
    expect(screen.queryByText(/Enquiry Received/i)).toBeNull();
    expect(document.body.textContent).not.toMatch(/confirmed|booked/i);

    // the form is still there and can be submitted again
    const retry = screen.getByRole('button', { name: /Submit Booking Enquiry/i });
    expect(retry).toBeEnabled();

    create.mockReturnValue(FAKE_ENQUIRY);
    fireEvent.click(retry);
    await waitFor(() => expect(screen.getByText(/Enquiry Received/i)).toBeInTheDocument(), { timeout: 3000 });
  });

  it('success says the enquiry was received and never that a booking is confirmed or a date is available', async () => {
    vi.spyOn(StorageService, 'createEnquiry').mockReturnValue(FAKE_ENQUIRY);
    reachReview();
    fireEvent.click(screen.getByRole('button', { name: /Submit Booking Enquiry/i }));
    await screen.findByText(/Enquiry Received/i, {}, { timeout: 3000 });
    const text = document.body.textContent ?? '';
    expect(text).toMatch(/received your enquiry/i);
    expect(text).not.toMatch(/confirmed|booked|is available|date is reserved/i);
    expect(text).toMatch(/confirm availability|check our bookings calendar/i);
  });

  it('requires the consent box before submitting', () => {
    renderPage();
    fillStep1();
    fillStep2();
    fireEvent.click(screen.getByRole('button', { name: /Submit Booking Enquiry/i }));
    const consent = screen.getByLabelText(/I give permission/i);
    expect(consent.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('alert').textContent).toMatch(/privacy and contact consent/i);
  });
});
