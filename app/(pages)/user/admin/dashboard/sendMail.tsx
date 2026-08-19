"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { MailIcon } from 'lucide-react';
import { toast } from 'sonner'; 

interface SendMailProps {
  to: string;
  userName: string
}

export default function SendMail({ to, userName }: SendMailProps) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMailToUser = async () => {
    if (!subject || !userName || !htmlContent) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/user/admin/send-mail-for-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ htmlContent, to, subject, userName })
      });

      if (res.ok) {
        toast.success('Email sent successfully');
        setOpen(false);
        setSubject('');
        setHtmlContent('');
      } else {
        toast.error('Failed to send email');
      }
    } catch (error) {
      console.error('Email send error:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Send Mail
          <MailIcon className="w-5 h-5 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Custom Mail</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Subject</label>
            <Input
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Message</label>
            <Textarea
              placeholder="Write your message here..."
              rows={6}
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={sendMailToUser} disabled={loading}>
            {loading ? 'Sending...' : 'Send Mail'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
