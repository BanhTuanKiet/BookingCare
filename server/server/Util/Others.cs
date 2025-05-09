using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using System.Net;

namespace server.Util
{
    public static class Others
    {
        public static int GetWeekOfMonth(DateTime date)
        {
            int day = date.Day;
            if (day <= 7) return 1;
            if (day <= 14) return 2;
            if (day <= 21) return 3;
            return 4;
        }
 
    }
}