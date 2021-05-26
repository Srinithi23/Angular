using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Restaurant.Models;

namespace Restaurant.Controllers
{
    public class OrderController : ApiController
    {
        private RestaurantDBEntities db = new RestaurantDBEntities();

        // GET: api/Order
        public System.Object GetORDERS()
        {
            var result = (from o in db.ORDERS
                          join c in db.CUSTOMERs on o.CUSTID equals c.CUSID
                          select new
                          {
                              o.ORDERID,
                              o.ORDERNO,
                              c.CUSTOMERNAME,
                              o.PAYMENT,
                              o.TOTALCOST
                          }).ToList();
            return result ;
        }

        // GET: api/Order/5
        [ResponseType(typeof(ORDER))]
        public IHttpActionResult GetORDER(long id)
        {
            try
            {
                var order = (from o in db.ORDERS
                             where o.ORDERID == id
                             select new
                             {
                                 o.ORDERID,
                                 o.ORDERNO,
                                 o.CUSTID,
                                 o.PAYMENT,
                                 o.TOTALCOST
                             }).FirstOrDefault();

                var orderDetails = (from a in db.ORDERDETAILS
                                    join b in db.ITEMS on a.ITEMID equals b.ITEMID
                                    where a.ORDER_ID == id

                                    select new
                                    {
                                        a.ORDER_ID,
                                        a.ORDERITEM_ID,
                                        a.ITEMID,
                                        b.ITEM_NAME,
                                        b.PRICE,
                                        a.QUANTITY,
                                        Total = a.QUANTITY * b.PRICE
                                    }).ToList();
                return Ok(new { order, orderDetails });
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        // PUT: api/Order/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutORDER(long id, ORDER oRDER)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != oRDER.ORDERID)
            {
                return BadRequest();
            }

            db.Entry(oRDER).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ORDERExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Order
        [ResponseType(typeof(ORDER))]
        public IHttpActionResult PostORDER(ORDER oRDER)
        {
            try 
            {
                db.ORDERS.Add(oRDER);

                foreach(var item in oRDER.ORDERDETAILS)
                {
                    db.ORDERDETAILS.Add(item);
                }

                db.SaveChanges();

                return Ok();
            } 
            catch (Exception ex)
            {
                throw ex;
            }

         
        }

        // DELETE: api/Order/5
        [ResponseType(typeof(ORDER))]
        public IHttpActionResult DeleteORDER(long id)
        {
            ORDER oRDER = db.ORDERS.Include(y=>y.ORDERDETAILS)
                .SingleOrDefault(x => x.ORDERID == id);

            foreach(var item in oRDER.ORDERDETAILS.ToList())
            {
                db.ORDERDETAILS.Remove(item);
            }

            db.ORDERS.Remove(oRDER);
            db.SaveChanges();

            return Ok(oRDER);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ORDERExists(long id)
        {
            return db.ORDERS.Count(e => e.ORDERID == id) > 0;
        }
    }
}